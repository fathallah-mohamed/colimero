import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  clientEmail: string;
  clientName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientEmail, clientName }: EmailRequest = await req.json();
    console.log("Sending activation confirmation emails for:", clientEmail);

    // Email au client
    const clientEmailResponse = await resend.emails.send({
      from: "Colimero <no-reply@colimero.com>",
      to: [clientEmail],
      subject: "Votre compte Colimero a été activé",
      html: `
        <h1>Bienvenue sur Colimero !</h1>
        <p>Votre compte a été activé avec succès.</p>
        <p>Vous pouvez maintenant vous connecter et commencer à utiliser nos services.</p>
        <p>Cordialement,<br>L'équipe Colimero</p>
      `,
    });

    console.log("Client confirmation email sent:", clientEmailResponse);

    // Email à l'admin
    const adminEmailResponse = await resend.emails.send({
      from: "Colimero <no-reply@colimero.com>",
      to: ["admin@colimero.com"],
      subject: "Nouveau compte client activé",
      html: `
        <h1>Nouveau compte activé</h1>
        <p>Le client ${clientName} (${clientEmail}) vient d'activer son compte.</p>
        <p>Cordialement,<br>L'équipe Colimero</p>
      `,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ message: "Confirmation emails sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error sending confirmation emails:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send confirmation emails" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);