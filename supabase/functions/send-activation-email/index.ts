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
      .select('first_name, activation_token')
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
        subject: 'Activez votre compte Colimero dès maintenant !',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Activation de votre compte Colimero</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  margin: 0;
                  padding: 0;
                  color: #333333;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  text-align: center;
                  padding: 20px 0;
                  background-color: #00B0F0;
                }
                .logo {
                  max-width: 200px;
                }
                .content {
                  padding: 20px;
                  background-color: #ffffff;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #00B0F0;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 4px;
                  margin: 20px 0;
                }
                .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color: #666666;
                }
                .link {
                  word-break: break-all;
                  color: #00B0F0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <!-- Logo Colimero -->
                  <img src="https://colimero.com/logo.png" alt="Colimero" class="logo">
                </div>
                <div class="content">
                  <h2>Bonjour ${client.first_name || ''}</h2>
                  
                  <p>Merci de rejoindre <strong>Colimero</strong>, votre plateforme de confiance pour l'expédition de colis !</p>
                  
                  <p>Pour activer votre compte et commencer à explorer nos services, veuillez cliquer sur le bouton ci-dessous :</p>
                  
                  <div style="text-align: center;">
                    <a href="${activationLink}" class="button">Activer mon compte</a>
                  </div>
                  
                  <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                  <p class="link">${activationLink}</p>
                  
                  <p><strong>Ce lien est valable pendant 48 heures.</strong></p>
                  <p>Si vous n'avez pas créé de compte sur Colimero, vous pouvez ignorer cet email.</p>
                  
                  <p>En cas de besoin, n'hésitez pas à nous contacter :<br>
                  <a href="mailto:support@colimero.com" class="link">support@colimero.com</a></p>
                </div>
                <div class="footer">
                  <p><strong>À très bientôt sur Colimero,</strong><br>
                  L'équipe Colimero</p>
                </div>
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