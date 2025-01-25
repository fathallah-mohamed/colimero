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

    if (!email?.trim()) {
      throw new Error('Email is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Vérifier si le client existe et récupérer ses informations
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('first_name, activation_code')
      .eq('email', email.trim())
      .single()

    if (clientError) {
      throw new Error('Client not found')
    }

    // Générer un nouveau code d'activation si nécessaire
    if (!client.activation_code) {
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          activation_code: supabase.rpc('generate_activation_code'),
          activation_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        })
        .eq('email', email.trim())
    }

    // Récupérer le code d'activation mis à jour
    const { data: updatedClient, error: fetchError } = await supabase
      .from('clients')
      .select('activation_code')
      .eq('email', email.trim())
      .single()

    if (fetchError || !updatedClient?.activation_code) {
      throw new Error('Failed to retrieve activation code')
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not set')
    }

    // Envoyer l'email avec le code d'activation
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
              ${updatedClient.activation_code}
            </div>
            <p><strong>Ce code est valable pendant 48 heures.</strong></p>
          </div>
        `,
      }),
    })

    if (!emailResponse.ok) {
      throw new Error('Failed to send activation email')
    }

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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})