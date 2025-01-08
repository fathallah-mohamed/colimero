import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceRole)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { requestId } = await req.json()

    // Get the request details
    const { data: request, error: requestError } = await supabase
      .from("carrier_registration_requests")
      .select("*")
      .eq("id", requestId)
      .maybeSingle();

    if (requestError) throw requestError;
    if (!request) throw new Error("Request not found");

    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8);

    // Create the auth user using admin API
    const { data: userData, error: createUserError } = await supabase.auth.admin.createUser({
      email: request.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        user_type: 'carrier',
        first_name: request.first_name,
        last_name: request.last_name,
        company_name: request.company_name
      },
      app_metadata: {
        provider: 'email',
        providers: ['email']
      }
    });

    if (createUserError) throw createUserError;

    // Update request status
    const { error: updateError } = await supabase
      .from("carrier_registration_requests")
      .update({ 
        status: "approved",
        email_verified: true,
        password: tempPassword
      })
      .eq("id", requestId);

    if (updateError) throw updateError;

    // Wait briefly for triggers to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify carrier was created
    const { data: carrier, error: verifyError } = await supabase
      .from("carriers")
      .select("*")
      .eq("id", requestId)
      .maybeSingle();

    if (verifyError) throw verifyError;
    if (!carrier) {
      throw new Error("Carrier creation failed - please try again");
    }

    // Send approval email
    const { error: emailError } = await supabase.functions.invoke("send-approval-email", {
      body: JSON.stringify({
        email: request.email,
        company_name: request.company_name,
        password: tempPassword
      }),
    });

    if (emailError) {
      console.error("Error sending approval email:", emailError);
      // Don't throw here as the carrier was still created successfully
    }

    return new Response(
      JSON.stringify({ success: true, carrier }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      },
    )
  }
})