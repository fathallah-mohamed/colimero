import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "admin@colimero.com";

interface VerificationRequest {
  token: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  try {
    // Handle CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const { token, email }: VerificationRequest = await req.json();
    console.log("Verifying activation for:", email);

    // Créer un client Supabase avec la clé service
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Vérifier et activer le compte
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('email', email)
      .eq('activation_token', token)
      .gte('activation_expires_at', new Date().toISOString())
      .single();

    if (clientError || !client) {
      throw new Error("Token invalide ou expiré");
    }

    // Activer le compte
    const { error: updateError } = await supabaseAdmin
      .from('clients')
      .update({
        is_activated: true,
        status: 'active',
        activation_token: null,
        activation_expires_at: null
      })
      .eq('id', client.id);

    if (updateError) {
      throw updateError;
    }

    // Envoyer l'email de notification à l'admin
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Colimero <no-reply@colimero.fr>",
        to: [ADMIN_EMAIL],
        subject: "Compte client activé",
        html: `
          <h2>Activation de compte client</h2>
          <p>Un client vient d'activer son compte :</p>
          <ul>
            <li><strong>Email :</strong> ${client.email}</li>
            ${client.first_name ? `<li><strong>Prénom :</strong> ${client.first_name}</li>` : ''}
            ${client.last_name ? `<li><strong>Nom :</strong> ${client.last_name}</li>` : ''}
          </ul>
        `,
      }),
    });

    if (!adminEmailRes.ok) {
      console.error("Error sending admin notification:", await adminEmailRes.text());
      // On continue même si l'email admin échoue
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in verify-activation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
};

Deno.serve(handler);