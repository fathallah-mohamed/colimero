import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "admin@colimero.com";

interface RegistrationRequest {
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
}

const handler = async (req: Request): Promise<Response> => {
  try {
    // Handle CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Get the request data
    const registrationRequest: RegistrationRequest = await req.json();
    console.log("Received registration request:", registrationRequest);

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Colimero <onboarding@colimero.com>",
        to: [ADMIN_EMAIL],
        subject: "Nouvelle demande d'inscription transporteur",
        html: `
          <h2>Nouvelle demande d'inscription transporteur</h2>
          <p>Un nouveau transporteur vient de s'inscrire sur la plateforme :</p>
          <ul>
            <li><strong>Entreprise :</strong> ${registrationRequest.company_name}</li>
            <li><strong>Nom :</strong> ${registrationRequest.last_name}</li>
            <li><strong>Prénom :</strong> ${registrationRequest.first_name}</li>
            <li><strong>Email :</strong> ${registrationRequest.email}</li>
          </ul>
          <p>Veuillez vous connecter à la plateforme pour examiner cette demande.</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }

    // Log the success
    console.log("Email sent successfully to admin");

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-registration-email function:", error);
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