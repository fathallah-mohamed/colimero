import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Create Supabase client
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

    if (requestError) {
      console.error("Error fetching request:", requestError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch carrier request", details: requestError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!request) {
      console.error("Request not found");
      return new Response(
        JSON.stringify({ error: "Carrier request not found" }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("Found carrier request:", request);

    // 2. Create auth user first
    const password = crypto.randomUUID().substring(0, 12);
    try {
      const { data: authUser, error: createUserError } = await supabaseClient.auth.admin.createUser({
        email: request.email,
        password: password,
        email_confirm: true,
        user_metadata: {
          user_type: 'carrier',
          first_name: request.first_name,
          last_name: request.last_name,
          company_name: request.company_name
        }
      });

      if (createUserError) throw createUserError;
      console.log("Auth user created:", authUser);

      // 3. Wait for auth user to be fully created
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 4. Update request status to approved and save password
      const { error: updateError } = await supabaseClient
        .from('carrier_registration_requests')
        .update({ 
          status: 'approved',
          password: password,
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

      // 5. Wait for triggers to execute
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 6. Insert carrier record
      const { error: carrierError } = await supabaseClient
        .from('carriers')
        .insert({
          id: authUser.user.id,
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
          total_deliveries: request.total_deliveries || 0,
          cities_covered: request.cities_covered || 30,
          status: 'active'
        });

      if (carrierError) {
        console.error("Error creating carrier:", carrierError);
        return new Response(
          JSON.stringify({ error: "Failed to create carrier", details: carrierError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // 7. Insert carrier capacities
      const { error: capacitiesError } = await supabaseClient
        .from('carrier_capacities')
        .insert({
          carrier_id: authUser.user.id,
          total_capacity: request.total_capacity || 1000,
          price_per_kg: request.price_per_kg || 12
        });

      if (capacitiesError) {
        console.error("Error creating carrier capacities:", capacitiesError);
        return new Response(
          JSON.stringify({ error: "Failed to create carrier capacities", details: capacitiesError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // 8. Insert carrier services
      if (request.services && request.services.length > 0) {
        const { error: servicesError } = await supabaseClient
          .from('carrier_services')
          .insert(
            request.services.map(service => ({
              carrier_id: authUser.user.id,
              service_type: service,
              icon: 'package'
            }))
          );

        if (servicesError) {
          console.error("Error creating carrier services:", servicesError);
          return new Response(
            JSON.stringify({ error: "Failed to create carrier services", details: servicesError.message }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      }

      console.log("Carrier approved successfully");
      return new Response(
        JSON.stringify({ 
          success: true, 
          carrier: authUser.user,
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