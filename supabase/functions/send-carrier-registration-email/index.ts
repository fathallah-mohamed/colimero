import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegistrationEmailData {
  email: string;
  company_name: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, company_name }: RegistrationEmailData = await req.json();
    console.log("Sending registration confirmation to:", email);

    const emailResponse = await resend.emails.send({
      from: "Colimero <no-reply@colimero.fr>",
      to: [email],
      subject: "Confirmation de votre demande d'inscription transporteur",
      html: `
        <h1>Bienvenue sur Colimero !</h1>
        <p>Nous avons bien reçu votre demande d'inscription en tant que transporteur pour ${company_name}.</p>
        <p>Notre équipe va examiner votre dossier dans les plus brefs délais.</p>
        <p>Vous recevrez un email de confirmation une fois votre compte validé par notre équipe.</p>
        <p>Cordialement,<br>L'équipe Colimero</p>
      `,
    });

    console.log("Carrier confirmation email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error sending carrier confirmation email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send carrier confirmation email" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);