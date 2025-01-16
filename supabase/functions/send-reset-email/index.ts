import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, resetLink } = await req.json()

    console.log('Sending reset email to:', email)
    console.log('Reset link:', resetLink)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <h2>Réinitialisation de votre mot de passe</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
          <p><a href="${resetLink}">Réinitialiser mon mot de passe</a></p>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
        `
      }),
    })

    const data = await res.json()
    console.log('Resend API response:', data)

    // Log the email attempt in the database
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
    await supabase.from('email_logs').insert([
      {
        email: email,
        status: res.ok ? 'success' : 'error',
        email_type: 'password_reset',
        error_message: res.ok ? null : JSON.stringify(data)
      }
    ])

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: res.ok ? 200 : 400
      }
    )
  } catch (error) {
    console.error('Error in send-reset-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})