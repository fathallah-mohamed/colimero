import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('first_name, activation_token')
      .eq('email', email)
      .single()

    if (clientError || !client) {
      console.error('Client fetch error:', clientError)
      throw new Error('Client not found')
    }

    let baseUrl = Deno.env.get('SITE_URL')
    if (!baseUrl) {
      console.error('SITE_URL environment variable is not set')
      throw new Error('Server configuration error')
    }

    baseUrl = baseUrl.replace(/\/+$/, '').replace(/:+$/, '')
    const activationLink = `${baseUrl}/activation?token=${client.activation_token}`

    console.log('Activation link generated:', activationLink)

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
        subject: 'Activez votre compte Colimero dès maintenant !',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Activation de votre compte Colimero</title>
            </head>
            <body>
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Bonjour ${client.first_name || ''}</h2>
                
                <p>Merci de rejoindre <strong>Colimero</strong> !</p>
                
                <p>Pour activer votre compte, cliquez sur le lien ci-dessous :</p>
                
                <p><a href="${activationLink}" style="color: #00B0F0;">Activer mon compte</a></p>
                
                <p>Si le lien ne fonctionne pas, copiez et collez cette adresse dans votre navigateur :</p>
                <p>${activationLink}</p>
                
                <p><strong>Ce lien est valable pendant 48 heures.</strong></p>
                
                <p>Si vous n'avez pas créé de compte sur Colimero, ignorez cet email.</p>
                
                <p>Besoin d'aide ? Contactez-nous : <a href="mailto:support@colimero.com">support@colimero.com</a></p>
                
                <p>À très bientôt sur Colimero !</p>
              </div>
            </body>
          </html>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      console.error('Email send error:', errorData)
      throw new Error('Failed to send activation email')
    }

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