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
    console.log('Received request to send activation email to:', email)

    if (!email) {
      throw new Error('Email is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get client details and activation token
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('first_name, activation_token')
      .eq('email', email)
      .single()

    if (clientError || !client) {
      console.error('Error fetching client:', clientError)
      throw new Error('Client not found')
    }

    console.log('Found client:', client)

    const baseUrl = Deno.env.get('SITE_URL')
    if (!baseUrl) {
      throw new Error('SITE_URL environment variable is not set')
    }

    const activationLink = `${baseUrl.replace(/\/+$/, '')}/activation?token=${client.activation_token}`
    console.log('Generated activation link:', activationLink)

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }

    console.log('Sending email via Resend...')
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
                
                <p style="margin: 20px 0;">
                  <a href="${activationLink}" 
                     style="background-color: #00B0F0; 
                            color: white; 
                            padding: 12px 24px; 
                            text-decoration: none; 
                            border-radius: 4px;
                            display: inline-block;">
                    Activer mon compte
                  </a>
                </p>
                
                <p>Si le bouton ne fonctionne pas, copiez et collez cette adresse dans votre navigateur :</p>
                <p style="background-color: #f5f5f5; padding: 10px; word-break: break-all;">
                  ${activationLink}
                </p>
                
                <p><strong>Ce lien est valable pendant 48 heures.</strong></p>
                
                <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                  Si vous n'avez pas créé de compte sur Colimero, ignorez cet email.
                </p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="color: #666; font-size: 0.8em;">
                  Besoin d'aide ? Contactez-nous : 
                  <a href="mailto:support@colimero.com" style="color: #00B0F0;">
                    support@colimero.com
                  </a>
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      console.error('Email sending failed:', errorData)
      throw new Error('Failed to send activation email')
    }

    console.log('Email sent successfully')

    // Log the email sending
    await supabase
      .from('email_logs')
      .insert({
        email: email,
        status: 'sent',
        email_type: 'activation'
      })

    return new Response(
      JSON.stringify({ message: 'Activation email sent successfully' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
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