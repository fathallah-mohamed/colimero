import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@2.0.0'

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
    const { email, firstName } = await req.json()
    console.log('Processing activation email request for:', email)

    if (!email?.trim()) {
      throw new Error('Email is required')
    }

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    console.log('Resend client initialized')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get client's activation code
    const { data: clientData, error: clientError } = await supabaseClient
      .from('clients')
      .select('activation_code')
      .eq('email', email.trim())
      .single()

    if (clientError || !clientData?.activation_code) {
      console.error('Error fetching client:', clientError)
      throw new Error('Could not retrieve activation code')
    }

    console.log('Retrieved activation code for client')

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Colimero <activation@colimero.com>',
      to: email.trim(),
      subject: 'Activez votre compte Colimero',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d; text-align: center;">Bienvenue ${firstName || ''}!</h2>
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

    console.log('Email sent successfully:', emailData)

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
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