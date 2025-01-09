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

      // Wait for triggers to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Update request status to approved and save password
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

      // 4. Wait for triggers to execute
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 5. Verify carrier was created
      const { data: carrier, error: verifyError } = await supabaseClient
        .from('carriers')
        .select('*')
        .eq('id', authUser.user.id)
        .single();

      if (verifyError || !carrier) {
        console.error("Error verifying carrier creation:", verifyError);
        return new Response(
          JSON.stringify({ error: "Failed to verify carrier creation", details: verifyError?.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log("Carrier approved successfully:", carrier);
      return new Response(
        JSON.stringify({ 
          success: true, 
          carrier,
          message: "Carrier approved and account created successfully"
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (err) {
      console.error("Error creating auth user:", err);
      return new Response(
        JSON.stringify({ error: "Failed to create auth user", details: err.message }),
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