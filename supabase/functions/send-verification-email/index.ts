import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface EmailData {
  email: string;
  first_name?: string;
  last_name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  try {
    // Handle CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const { email, first_name, last_name }: EmailData = await req.json();
    console.log("Sending verification email to:", email);

    // Send verification email to user
    const userEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Colimero <no-reply@colimero.fr>",
        to: [email],
        subject: "Vérifiez votre email - Colimero",
        html: `
          <h1>Bienvenue sur Colimero !</h1>
          <p>Bonjour ${first_name || 'cher utilisateur'},</p>
          <p>Merci de vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
          <p><a href="${Deno.env.get('SITE_URL')}/verify-email?email=${encodeURIComponent(email)}">Vérifier mon email</a></p>
          <p>Si vous n'avez pas créé de compte sur Colimero, vous pouvez ignorer cet email.</p>
        `,
      }),
    });

    if (!userEmailRes.ok) {
      const error = await userEmailRes.text();
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }

    // Send notification to admin
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Colimero <no-reply@colimero.fr>",
        to: ["admin@colimero.com"],
        subject: "Nouvelle vérification d'email",
        html: `
          <h2>Nouvelle vérification d'email</h2>
          <p>Un utilisateur vient de demander une vérification d'email :</p>
          <ul>
            <li><strong>Email :</strong> ${email}</li>
            ${first_name ? `<li><strong>Prénom :</strong> ${first_name}</li>` : ''}
            ${last_name ? `<li><strong>Nom :</strong> ${last_name}</li>` : ''}
          </ul>
        `,
      }),
    });

    if (!adminEmailRes.ok) {
      console.error("Error sending admin notification:", await adminEmailRes.text());
      // Continue even if admin email fails
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-verification-email function:", error);
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