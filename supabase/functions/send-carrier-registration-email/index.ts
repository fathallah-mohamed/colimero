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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <img src="https://colimero.fr/logo.png" alt="Colimero Logo" style="max-width: 200px; margin: 20px 0;" />
          
          <h1 style="color: #00B0F0; margin-bottom: 20px;">Bienvenue sur Colimero !</h1>
          
          <p style="font-size: 16px; line-height: 1.5; color: #333;">
            Nous avons bien reçu votre demande d'inscription en tant que transporteur pour <strong>${company_name}</strong>.
          </p>

          <div style="background-color: #f8f9fa; border-left: 4px solid #00B0F0; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #555;">
              Notre équipe va examiner votre dossier dans les plus brefs délais. 
              Vous recevrez un email de confirmation une fois votre compte validé par notre équipe.
            </p>
          </div>

          <p style="font-size: 16px; line-height: 1.5; color: #333;">
            En attendant, n'hésitez pas à préparer les documents suivants qui pourront vous être demandés :
          </p>

          <ul style="color: #555; line-height: 1.6;">
            <li>Kbis de moins de 3 mois</li>
            <li>Attestation d'assurance professionnelle</li>
            <li>Licence de transport</li>
          </ul>

          <p style="font-size: 16px; line-height: 1.5; color: #333;">
            Si vous avez des questions, notre équipe support est à votre disposition.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              Cordialement,<br>
              L'équipe Colimero
            </p>
          </div>
        </div>
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