import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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
    )

    // Get request body
    const { requestId } = await req.json()
    console.log("Processing request ID:", requestId)

    if (!requestId) {
      console.error("No request ID provided")
      return new Response(
        JSON.stringify({ error: "Request ID is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // 1. Vérifier que la demande existe et récupérer ses données
    const { data: request, error: requestError } = await supabaseClient
      .from("carrier_registration_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (requestError) {
      console.error("Error fetching request:", requestError)
      return new Response(
        JSON.stringify({ error: "Failed to fetch carrier request", details: requestError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!request) {
      console.error("Request not found")
      return new Response(
        JSON.stringify({ error: "Carrier request not found" }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // 2. Mettre à jour le statut de la demande
    const { error: updateError } = await supabaseClient
      .from('carrier_registration_requests')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)

    if (updateError) {
      console.error("Error updating carrier request:", updateError)
      return new Response(
        JSON.stringify({ error: "Failed to update carrier request status", details: updateError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // 3. Attendre que les triggers s'exécutent
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 4. Vérifier que le transporteur a bien été créé
    const { data: carrier, error: verifyError } = await supabaseClient
      .from('carriers')
      .select('*')
      .eq('id', requestId)
      .single()

    if (verifyError || !carrier) {
      console.error("Error verifying carrier creation:", verifyError)
      return new Response(
        JSON.stringify({ error: "Failed to verify carrier creation", details: verifyError?.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log("Carrier approved successfully:", carrier)
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
    )

  } catch (error) {
    console.error("Unexpected error:", error)
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})