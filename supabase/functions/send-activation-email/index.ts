import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Loading send-activation-email function")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()
    console.log("Processing activation email for:", email)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get client data
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (clientError || !client) {
      console.error("Error fetching client:", clientError)
      throw new Error('Client not found')
    }

    // Créer le lien d'activation en utilisant SITE_URL directement
    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173'
    const activationLink = `${siteUrl}/activation?token=${client.activation_token}`

    // Send email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: 'Colimero <activation@colimero.com>',
        to: [email],
        subject: 'Activez votre compte Colimero',
        html: `
          <h1>Bienvenue sur Colimero !</h1>
          <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
          <p><a href="${activationLink}">Activer mon compte</a></p>
          <p>Ce lien est valable pendant 24 heures.</p>
          <p>Si vous n'avez pas créé de compte sur Colimero, vous pouvez ignorer cet email.</p>
        `
      })
    })

    if (!emailResponse.ok) {
      const error = await emailResponse.text()
      console.error("Error sending email:", error)
      throw new Error('Failed to send activation email')
    }

    // Log email sending
    await supabase
      .from('email_logs')
      .insert({
        email: email,
        status: 'sent',
        email_type: 'activation'
      })

    console.log("Activation email sent successfully to:", email)

    return new Response(
      JSON.stringify({ message: 'Activation email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Function error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})