import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceRole)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { requestId } = await req.json()
    console.log("Processing request ID:", requestId)

    // Get the request details
    const { data: request, error: requestError } = await supabase
      .from("carrier_registration_requests")
      .select("*")
      .eq("id", requestId)
      .maybeSingle()

    if (requestError) {
      console.error("Error fetching request:", requestError)
      throw new Error("Failed to fetch carrier request")
    }

    if (!request) {
      console.error("Request not found:", requestId)
      throw new Error("Carrier request not found")
    }

    console.log("Found carrier request:", request)

    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8)

    // Update request status first
    const { error: updateError } = await supabase
      .from("carrier_registration_requests")
      .update({ 
        status: "approved",
        password: tempPassword,
        email_verified: true
      })
      .eq("id", requestId)

    if (updateError) {
      console.error("Error updating request:", updateError)
      throw new Error("Failed to update carrier request status")
    }

    // Wait briefly for triggers to complete
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Verify carrier was created
    const { data: carrier, error: verifyError } = await supabase
      .from("carriers")
      .select("*")
      .eq("id", requestId)
      .maybeSingle()

    if (verifyError) {
      console.error("Error verifying carrier creation:", verifyError)
      throw new Error("Failed to verify carrier creation")
    }

    if (!carrier) {
      console.error("Carrier not created:", requestId)
      throw new Error("Carrier creation failed - please try again")
    }

    console.log("Carrier created successfully:", carrier)

    // Send approval email
    const { error: emailError } = await supabase.functions.invoke("send-approval-email", {
      body: JSON.stringify({
        email: request.email,
        company_name: request.company_name,
        password: tempPassword
      }),
    })

    if (emailError) {
      console.error("Error sending approval email:", emailError)
      // Don't throw here as the carrier was still created successfully
    }

    return new Response(
      JSON.stringify({ success: true, carrier }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    console.error("Error in approve-carrier function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      },
    )
  }
})