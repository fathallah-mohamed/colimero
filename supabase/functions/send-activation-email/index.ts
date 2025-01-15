import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Resend } from 'https://esm.sh/@resend/node'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Starting send-activation-email function")

serve(async (req) => {
  // Handle CORS
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

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    // Create activation link
    const activationLink = `${Deno.env.get('SITE_URL')}/activation?token=${client.activation_token}`

    // Send email
    const { data, error: emailError } = await resend.emails.send({
      from: 'Colis Express <activation@colisexpress.com>',
      to: email,
      subject: 'Activez votre compte Colis Express',
      html: `
        <h1>Bienvenue sur Colis Express !</h1>
        <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <p><a href="${activationLink}">Activer mon compte</a></p>
        <p>Ce lien est valable pendant 24 heures.</p>
        <p>Si vous n'avez pas créé de compte sur Colis Express, vous pouvez ignorer cet email.</p>
      `
    })

    if (emailError) {
      console.error("Error sending email:", emailError)
      throw emailError
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})