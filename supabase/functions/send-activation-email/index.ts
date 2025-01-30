import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@1.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, resend: isResend = false } = await req.json()
    
    if (!email) {
      throw new Error('Email is required')
    }

    console.log('Processing activation email request for:', email)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get client data
    const { data: clientData, error: clientError } = await supabaseClient
      .from('clients')
      .select('activation_code, first_name')
      .eq('email', email)
      .single()

    if (clientError) {
      console.error('Error fetching client:', clientError)
      throw new Error('Client not found')
    }

    if (!clientData?.activation_code) {
      console.error('No activation code found for client')
      throw new Error('No activation code found')
    }

    console.log('Client data found, sending email...')

    const resendClient = new Resend(Deno.env.get('RESEND_API_KEY'))

    // Send activation email
    const { data: emailData, error: emailError } = await resendClient.emails.send({
      from: 'Colimero <activation@colimero.app>',
      to: email,
      subject: 'Activez votre compte Colimero',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d; text-align: center;">Bienvenue${clientData.first_name ? ` ${clientData.first_name}` : ''} !</h2>
          <p style="color: #4a5568; text-align: center;">
            Merci de vous être inscrit sur Colimero. Pour activer votre compte, veuillez utiliser le code suivant :
          </p>
          <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="font-size: 24px; letter-spacing: 5px; margin: 0; color: #2d3748;">
              ${clientData.activation_code}
            </h3>
          </div>
          <p style="color: #718096; text-align: center; font-size: 14px;">
            Ce code est valable pendant 48 heures. Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.
          </p>
        </div>
      `
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      throw emailError
    }

    console.log('Email sent successfully')

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