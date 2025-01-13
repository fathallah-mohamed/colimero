import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY')
const MAILGUN_DOMAIN = 'colimero.com' // Updated domain

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  email: string;
  resetLink: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, resetLink } = await req.json() as EmailRequest

    console.log('Sending reset email to:', email)
    console.log('Reset link:', resetLink)

    const mailgunEndpoint = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`
    const authHeader = `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`

    const formData = new FormData()
    formData.append('from', `Colimero <no-reply@${MAILGUN_DOMAIN}>`)
    formData.append('to', email)
    formData.append('subject', 'Réinitialisation de votre mot de passe')
    formData.append('html', `
      <h2>Réinitialisation de votre mot de passe</h2>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
      <p>Cordialement,<br>L'équipe Colimero</p>
    `)

    const response = await fetch(mailgunEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Mailgun API error:', errorData)
      throw new Error(`Mailgun API error: ${errorData}`)
    }

    const result = await response.json()
    console.log('Email sent successfully:', result)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})