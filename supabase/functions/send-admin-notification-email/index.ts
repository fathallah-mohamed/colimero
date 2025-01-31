import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationData {
  carrierEmail: string;
  companyName: string;
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { carrierEmail, companyName, adminEmail }: AdminNotificationData = await req.json();
    console.log("Sending admin notification for new carrier:", carrierEmail);

    const emailResponse = await resend.emails.send({
      from: "Colimero <no-reply@colimero.com>",
      to: [adminEmail],
      subject: "Nouvelle demande d'inscription transporteur",
      html: `
        <h1>Nouvelle demande d'inscription transporteur</h1>
        <p>Une nouvelle demande d'inscription transporteur a été reçue :</p>
        <ul>
          <li><strong>Entreprise :</strong> ${companyName}</li>
          <li><strong>Email :</strong> ${carrierEmail}</li>
        </ul>
        <p>Veuillez vous connecter à la plateforme pour examiner cette demande.</p>
        <p>Cordialement,<br>L'équipe Colimero</p>
      `,
    });

    console.log("Admin notification email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send admin notification email" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);