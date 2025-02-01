import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  isCarrier: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting send-password-setup-confirmation function");
    
    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service configuration is missing");
    }

    const resend = new Resend(resendApiKey);
    const { email, isCarrier }: EmailRequest = await req.json();

    console.log("Sending confirmation email to:", email);

    // Send confirmation to user
    await resend.emails.send({
      from: "Colimero <no-reply@colimero.com>",
      to: [email],
      subject: "Confirmation de la configuration de votre mot de passe",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Configuration du mot de passe réussie</h2>
          <p>Votre mot de passe a été configuré avec succès.</p>
          <p>Vous pouvez maintenant vous connecter à votre compte avec votre email et votre nouveau mot de passe.</p>
          <p>Cordialement,<br>L'équipe Colimero</p>
        </div>
      `,
    });

    // If it's a carrier, also notify admin
    if (isCarrier) {
      await resend.emails.send({
        from: "Colimero <no-reply@colimero.com>",
        to: ["admin@colimero.com"],
        subject: "Un transporteur a activé son compte",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Activation de compte transporteur</h2>
            <p>Le transporteur avec l'email ${email} a configuré son mot de passe et activé son compte.</p>
            <p>Cordialement,<br>L'équipe Colimero</p>
          </div>
        `,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-password-setup-confirmation:", error);
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