import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TempPasswordEmailData {
  email: string;
  company_name: string;
  temp_password: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting send-temp-password-email function");
    const { email, company_name, temp_password }: TempPasswordEmailData = await req.json();

    console.log("Sending temporary password email to:", email);
    const emailResponse = await resend.emails.send({
      from: "Colimero <no-reply@colimero.com>",
      to: [email],
      subject: "Vos identifiants de connexion Colimero",
      html: `
        <h1>Bienvenue ${company_name} !</h1>
        <p>Votre compte transporteur a été approuvé. Vous pouvez maintenant vous connecter à votre espace transporteur.</p>
        <p>Voici votre mot de passe temporaire : <strong>${temp_password}</strong></p>
        <p>Pour des raisons de sécurité, nous vous recommandons de changer ce mot de passe lors de votre première connexion.</p>
        <p>Cordialement,<br>L'équipe Colimero</p>
      `,
    });

    console.log("Temporary password email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-temp-password-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);