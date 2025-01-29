import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0"

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
    console.log('Processing activation email request for:', email)

    if (!email?.trim()) {
      throw new Error('Email is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Récupérer le code d'activation
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('activation_code, first_name')
      .eq('email', email.trim())
      .single()

    if (clientError) {
      console.error('Error fetching client:', clientError)
      throw new Error('Client not found')
    }

    // Initialiser Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    console.log('Sending activation email with code:', client.activation_code)

    // Envoyer l'email
    const { data: emailResponse, error: emailError } = await resend.emails.send({
      from: 'Colimero <no-reply@colimero.com>',
      to: email.trim(),
      subject: 'Activez votre compte Colimero',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Bonjour ${client.first_name || ''}</h2>
          <p>Voici votre code d'activation :</p>
          <div style="background-color: #f5f5f5; 
                     padding: 20px; 
                     text-align: center; 
                     font-size: 24px; 
                     font-weight: bold; 
                     letter-spacing: 5px;
                     margin: 20px 0;">
            ${client.activation_code}
          </div>
          <p><strong>Ce code est valable pendant 48 heures.</strong></p>
        </div>
      `,
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      throw new Error('Failed to send activation email')
    }

    console.log('Activation email sent successfully:', emailResponse)

    // Enregistrer l'envoi de l'email
    await supabase
      .from('email_logs')
      .insert({
        email: email.trim(),
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
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 400 
      }
    )
  }
})