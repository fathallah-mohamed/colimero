import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "admin@colimero.com";

interface EmailData {
  email: string;
  activation_token: string;
  first_name?: string;
  last_name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  try {
    // Handle CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const { email, activation_token, first_name, last_name }: EmailData = await req.json();
    console.log("Sending activation email to:", email);

    // Construire l'URL d'activation (à adapter selon votre frontend)
    const activationUrl = `https://votre-domaine.com/activation?token=${activation_token}&email=${encodeURIComponent(email)}`;

    // Envoyer l'email d'activation au client
    const clientEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Colimero <no-reply@colimero.fr>",
        to: [email],
        subject: "Activez votre compte Colimero",
        html: `
          <h1>Bienvenue sur Colimero !</h1>
          <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
          <p><a href="${activationUrl}">Activer mon compte</a></p>
          <p>Ce lien est valable pendant 24 heures.</p>
          <p>Si vous n'avez pas créé de compte sur Colimero, vous pouvez ignorer cet email.</p>
        `,
      }),
    });

    if (!clientEmailRes.ok) {
      const error = await clientEmailRes.text();
      console.error("Error sending client email:", error);
      throw new Error("Failed to send activation email");
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
        subject: "Nouvelle inscription client",
        html: `
          <h2>Nouvelle inscription client</h2>
          <p>Un nouveau client vient de s'inscrire sur la plateforme :</p>
          <ul>
            <li><strong>Email :</strong> ${email}</li>
            ${first_name ? `<li><strong>Prénom :</strong> ${first_name}</li>` : ''}
            ${last_name ? `<li><strong>Nom :</strong> ${last_name}</li>` : ''}
          </ul>
          <p>Le client doit activer son compte via le lien envoyé par email.</p>
        `,
      }),
    });

    if (!adminEmailRes.ok) {
      console.error("Error sending admin notification:", await adminEmailRes.text());
      // On continue même si l'email admin échoue
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-activation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

Deno.serve(handler);