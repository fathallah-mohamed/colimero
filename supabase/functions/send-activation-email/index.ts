import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface ActivationEmailRequest {
  email: string;
  first_name: string;
  activation_token: string;
}

const handler = async (req: Request): Promise<Response> => {
  try {
    // Handle CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Get the request data
    const { email, first_name, activation_token }: ActivationEmailRequest = await req.json();
    console.log("Sending activation email to:", email);

    const activationUrl = `${req.headers.get("origin")}/activation?token=${activation_token}`;

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Colimero <noreply@colimero.com>",
        to: [email],
        subject: "Activez votre compte Colimero",
        html: `
          <h2>Bienvenue sur Colimero, ${first_name} !</h2>
          <p>Pour activer votre compte et commencer à utiliser nos services, veuillez cliquer sur le lien ci-dessous :</p>
          <p><a href="${activationUrl}">Activer mon compte</a></p>
          <p>Ce lien est valable pendant 24 heures.</p>
          <p>Si vous n'avez pas créé de compte sur Colimero, vous pouvez ignorer cet email.</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending email:", error);
      throw new Error("Failed to send activation email");
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