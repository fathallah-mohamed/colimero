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
    const requestData = await req.json()
    const { email, resend } = requestData

    console.log('📧 Starting send-activation-email for:', { email, resend })

    if (!email || typeof email !== 'string' || !email.trim()) {
      console.error('❌ No email provided in request')
      throw new Error('Email is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Vérifier si le client existe et n'est pas déjà vérifié
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('email_verified, first_name, activation_code')
      .eq('email', email.trim())
      .maybeSingle()

    console.log('🔍 Client lookup result:', { 
      found: !!client, 
      verified: client?.email_verified,
      error: clientError?.message 
    })

    if (clientError) {
      console.error('❌ Error fetching client:', clientError)
      throw new Error(`Database error: ${clientError.message}`)
    }

    if (!client) {
      console.error('❌ No client found for email:', email)
      throw new Error('No client found with this email address')
    }

    if (client.email_verified && !resend) {
      console.log('✅ Client already verified')
      throw new Error('Email already verified')
    }

    // Générer un nouveau code d'activation si nécessaire
    if (resend || !client.activation_code) {
      console.log('🔑 Generating new activation code for:', email)
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          activation_code: supabase.rpc('generate_activation_code'),
          activation_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        })
        .eq('email', email.trim())
        .select('activation_code')
        .single()

      if (updateError) {
        console.error('❌ Error updating activation code:', updateError)
        throw new Error('Failed to generate activation code')
      }
    }

    // Récupérer le code d'activation mis à jour
    const { data: updatedClient, error: fetchError } = await supabase
      .from('clients')
      .select('activation_code, first_name')
      .eq('email', email.trim())
      .single()

    if (fetchError || !updatedClient?.activation_code) {
      console.error('❌ Error fetching updated client:', fetchError)
      throw new Error('Failed to retrieve activation code')
    }

    const activationCode = updatedClient.activation_code
    console.log('✨ Activation code retrieved:', activationCode)

    const baseUrl = Deno.env.get('SITE_URL')
    if (!baseUrl) {
      console.error('❌ SITE_URL environment variable is not set')
      throw new Error('SITE_URL environment variable is not set')
    }

    const cleanBaseUrl = baseUrl.replace(/^(https?:\/\/)?(www\.)?/, 'https://').replace(/\/$/, '')
    const activationUrl = `${cleanBaseUrl}/activation?code=${activationCode}`
    console.log('🔗 Generated activation URL:', activationUrl)

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY environment variable is not set')
      throw new Error('RESEND_API_KEY environment variable is not set')
    }

    console.log('📤 Sending email via Resend...')
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Colimero <no-reply@colimero.com>',
        to: email.trim(),
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
                <h2>Bonjour ${updatedClient.first_name || ''}</h2>
                
                <p>Merci de rejoindre <strong>Colimero</strong> !</p>
                
                <p>Voici votre code d'activation :</p>
                
                <div style="background-color: #f5f5f5; 
                           padding: 20px; 
                           text-align: center; 
                           font-size: 24px; 
                           font-weight: bold; 
                           letter-spacing: 5px;
                           margin: 20px 0;">
                  ${activationCode}
                </div>
                
                <p>Vous pouvez également cliquer sur le lien ci-dessous pour activer votre compte :</p>
                
                <p style="margin: 20px 0;">
                  <a href="${activationUrl}" 
                     style="background-color: #00B0F0; 
                            color: white; 
                            padding: 12px 24px; 
                            text-decoration: none; 
                            border-radius: 4px;
                            display: inline-block;">
                    Activer mon compte
                  </a>
                </p>
                
                <p><strong>Ce code est valable pendant 48 heures.</strong></p>
                
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
      console.error('❌ Email sending failed:', errorData)
      throw new Error('Failed to send activation email')
    }

    console.log('✅ Email sent successfully')

    // Enregistrer l'envoi de l'email
    await supabase
      .from('email_logs')
      .insert({
        email: email.trim(),
        status: 'sent',
        email_type: 'activation'
      })

    console.log('📝 Email log created')

    return new Response(
      JSON.stringify({ message: 'Activation email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})