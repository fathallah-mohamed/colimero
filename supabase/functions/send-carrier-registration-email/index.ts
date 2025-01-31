import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "admin@colimero.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegistrationEmailData {
  email: string;
  company_name: string;
  first_name: string;
  last_name: string;
  temp_password?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      throw new Error("Email service configuration is missing");
    }

    const { email, company_name, first_name, last_name, temp_password }: RegistrationEmailData = await req.json();
    console.log("Processing registration emails for:", email);

    // 1. Email to carrier confirming registration
    const carrierEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Colimero <no-reply@colimero.fr>",
        to: [email],
        subject: "Confirmation de votre demande d'inscription transporteur",
        html: `
          <h1>Bonjour ${first_name} ${last_name},</h1>
          <p>Nous avons bien reçu votre demande d'inscription en tant que transporteur pour ${company_name}.</p>
          <p>Notre équipe va examiner votre dossier dans les plus brefs délais.</p>
          <p>Vous recevrez un email de confirmation une fois votre compte validé.</p>
          <p>Cordialement,<br>L'équipe Colimero</p>
        `,
      }),
    });

    if (!carrierEmailResponse.ok) {
      throw new Error("Failed to send carrier confirmation email");
    }

    // 2. Email to admin about new registration
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Colimero <no-reply@colimero.fr>",
        to: [ADMIN_EMAIL],
        subject: "Nouvelle demande d'inscription transporteur",
        html: `
          <h2>Nouvelle demande d'inscription transporteur</h2>
          <p>Un nouveau transporteur vient de s'inscrire sur la plateforme :</p>
          <ul>
            <li><strong>Entreprise :</strong> ${company_name}</li>
            <li><strong>Nom :</strong> ${last_name}</li>
            <li><strong>Prénom :</strong> ${first_name}</li>
            <li><strong>Email :</strong> ${email}</li>
          </ul>
          <p>Veuillez vous connecter à la plateforme pour examiner cette demande.</p>
        `,
      }),
    });

    if (!adminEmailResponse.ok) {
      throw new Error("Failed to send admin notification email");
    }

    // 3. If temp_password is provided (approval case), send credentials email
    if (temp_password) {
      const credentialsEmailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Colimero <no-reply@colimero.fr>",
          to: [email],
          subject: "Vos identifiants de connexion Colimero",
          html: `
            <h1>Bienvenue sur Colimero !</h1>
            <p>Votre compte transporteur a été validé. Voici vos identifiants de connexion :</p>
            <ul>
              <li><strong>Email :</strong> ${email}</li>
              <li><strong>Mot de passe temporaire :</strong> ${temp_password}</li>
            </ul>
            <p>Pour des raisons de sécurité, vous devrez changer ce mot de passe lors de votre première connexion.</p>
            <p>Cordialement,<br>L'équipe Colimero</p>
          `,
        }),
      });

      if (!credentialsEmailResponse.ok) {
        throw new Error("Failed to send credentials email");
      }
    }

    console.log("All registration emails sent successfully");
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-carrier-registration-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while sending the emails" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);