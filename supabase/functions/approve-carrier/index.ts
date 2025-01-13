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

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
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
    const { data: request, error: requestError } = await supabaseAdmin
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
      // Check if user already exists
      console.log("Checking for existing user with email:", request.email);
      const { data: { users }, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listUsersError) {
        console.error("Error listing users:", listUsersError);
        throw new Error("Database error finding users");
      }

      const existingUser = users?.find(user => user.email === request.email);
      let userId;

      if (existingUser) {
        console.log("User already exists, using existing user ID:", existingUser.id);
        userId = existingUser.id;
        
        // Update existing user metadata
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          {
            email: request.email,
            user_metadata: {
              user_type: 'carrier',
              first_name: request.first_name,
              last_name: request.last_name,
              company_name: request.company_name
            }
          }
        );

        if (updateError) throw updateError;
      } else {
        // Create new auth user
        console.log("Creating new auth user");
        const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
          email: request.email,
          password: request.password || Math.random().toString(36).slice(-8),
          email_confirm: true,
          user_metadata: {
            user_type: 'carrier',
            first_name: request.first_name,
            last_name: request.last_name,
            company_name: request.company_name
          }
        });

        if (createUserError) throw createUserError;
        if (!authData?.user) throw new Error("Failed to create auth user");
        
        userId = authData.user.id;
        console.log("Auth user created successfully:", authData);
      }

      // Create or update carrier profile
      const { error: carrierError } = await supabaseAdmin
        .from('carriers')
        .upsert({
          id: userId,
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

      if (carrierError) throw carrierError;

      // Create or update carrier capacities
      const { error: capacityError } = await supabaseAdmin
        .from('carrier_capacities')
        .upsert({
          carrier_id: userId,
          total_capacity: request.total_capacity || 1000,
          price_per_kg: request.price_per_kg || 12
        });

      if (capacityError) throw capacityError;

      // Delete existing services first
      if (request.services && request.services.length > 0) {
        const { error: deleteError } = await supabaseAdmin
          .from('carrier_services')
          .delete()
          .eq('carrier_id', userId);

        if (deleteError) throw deleteError;

        // Create carrier services
        const { error: servicesError } = await supabaseAdmin
          .from('carrier_services')
          .insert(
            request.services.map(service => ({
              carrier_id: userId,
              service_type: service,
              icon: 'package'
            }))
          );

        if (servicesError) throw servicesError;
      }

      // Update request status
      const { error: statusError } = await supabaseAdmin
        .from('carrier_registration_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (statusError) throw statusError;

      console.log("Carrier approval process completed successfully");
      return new Response(
        JSON.stringify({ 
          success: true, 
          carrier: { id: userId },
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