import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Loading send-activation-email function...')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('activation_token')
      .eq('email', email)
      .single()

    if (clientError || !client) {
      console.error('Client fetch error:', clientError)
      throw new Error('Client not found')
    }

    // Get the base URL from environment, fallback to a default if not set
    let baseUrl = Deno.env.get('SITE_URL')
    if (!baseUrl) {
      console.error('SITE_URL environment variable is not set')
      throw new Error('Server configuration error')
    }

    // Clean the base URL: remove trailing slashes and ensure no trailing colon
    baseUrl = baseUrl.replace(/\/+$/, '').replace(/:+$/, '')
    const activationLink = `${baseUrl}/activation?token=${client.activation_token}`

    console.log('Activation link generated:', activationLink)

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set')
      throw new Error('Server configuration error')
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Colimero <no-reply@colimero.com>',
        to: email,
        subject: 'Activez votre compte Colimero',
        html: `
          <h1>Bienvenue sur Colimero !</h1>
          <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
          <p><a href="${activationLink}">Activer mon compte</a></p>
          <p>Ce lien expire dans 24 heures.</p>
          <p>Si vous n'avez pas créé de compte sur Colimero, vous pouvez ignorer cet email.</p>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      console.error('Email send error:', errorData)
      throw new Error('Failed to send activation email')
    }

    // Log the successful email sending
    await supabase
      .from('email_logs')
      .insert({
        email: email,
        status: 'sent',
        email_type: 'activation'
      })

    return new Response(
      JSON.stringify({ message: 'Activation email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})