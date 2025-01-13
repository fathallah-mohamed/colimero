import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId } = await req.json();
    console.log("Processing approval for request:", requestId);

    if (!requestId) {
      console.error("No request ID provided");
      return new Response(
        JSON.stringify({ error: "Request ID is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

    // 1. Fetch the carrier request
    const { data: request, error: requestError } = await supabaseClient
      .from("carrier_registration_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (requestError || !request) {
      console.error("Error fetching request:", requestError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch carrier request", details: requestError?.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("Found carrier request:", request);

    try {
      // 2. Create auth user with the password from the request
      const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
        email: request.email,
        password: request.password,
        email_confirm: true,
        user_metadata: {
          user_type: 'carrier',
          first_name: request.first_name,
          last_name: request.last_name,
          company_name: request.company_name
        }
      });

      if (authError) throw authError;
      console.log("Auth user created:", authData);

      // 3. Update request status
      const { error: updateError } = await supabaseClient
        .from('carrier_registration_requests')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) {
        console.error("Error updating carrier request:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update carrier request status", details: updateError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // 4. Create carrier profile
      const { error: carrierError } = await supabaseClient
        .from('carriers')
        .insert({
          id: authData.user.id,
          email: request.email,
          first_name: request.first_name,
          last_name: request.last_name,
          phone: request.phone,
          phone_secondary: request.phone_secondary,
          company_name: request.company_name,
          siret: request.siret,
          address: request.address,
          coverage_area: request.coverage_area,
          avatar_url: request.avatar_url,
          email_verified: true,
          company_details: request.company_details,
          authorized_routes: request.authorized_routes,
          total_deliveries: 0,
          cities_covered: 30,
          status: 'active'
        });

      if (carrierError) throw carrierError;

      // 5. Create carrier capacities
      const { error: capacityError } = await supabaseClient
        .from('carrier_capacities')
        .insert({
          carrier_id: authData.user.id,
          total_capacity: request.total_capacity,
          price_per_kg: request.price_per_kg
        });

      if (capacityError) throw capacityError;

      // 6. Create carrier services
      if (request.services && request.services.length > 0) {
        const services = request.services.map(service => ({
          carrier_id: authData.user.id,
          service_type: service,
          icon: 'package'
        }));

        const { error: servicesError } = await supabaseClient
          .from('carrier_services')
          .insert(services);

        if (servicesError) throw servicesError;
      }

      console.log("Carrier approved successfully");
      return new Response(
        JSON.stringify({ 
          success: true, 
          carrier: authData.user,
          message: "Carrier approved and account created successfully"
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (err) {
      console.error("Error in approval process:", err);
      return new Response(
        JSON.stringify({ error: "Failed to complete approval process", details: err.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (err) {
    console.error("Error in approve-carrier function:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});