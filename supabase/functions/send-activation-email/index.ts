import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@1.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email } = await req.json()
    
    if (!email) {
      throw new Error('Email is required')
    }

    // Get client data
    const { data: clientData, error: clientError } = await supabaseClient
      .from('clients')
      .select('activation_code, first_name')
      .eq('email', email)
      .single()

    if (clientError || !clientData?.activation_code) {
      throw new Error('Client not found or no activation code')
    }

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    // Send activation email
    const { data, error: emailError } = await resend.emails.send({
      from: 'activation@votreapp.com',
      to: email,
      subject: 'Activez votre compte',
      html: `
        <h2>Bienvenue${clientData.first_name ? ` ${clientData.first_name}` : ''} !</h2>
        <p>Merci de vous être inscrit. Pour activer votre compte, veuillez utiliser le code suivant :</p>
        <h3 style="font-size: 24px; letter-spacing: 5px; background-color: #f0f0f0; padding: 10px; text-align: center;">
          ${clientData.activation_code}
        </h3>
        <p>Ce code est valable pendant 48 heures.</p>
      `
    })

    if (emailError) {
      throw emailError
    }

    // Log the email sending
    await supabaseClient
      .from('email_logs')
      .insert({
        email,
        status: 'sent',
        email_type: 'activation'
      })

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})