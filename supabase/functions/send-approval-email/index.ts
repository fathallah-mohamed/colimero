import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  company_name: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting send-approval-email function");
    const { email, company_name }: EmailRequest = await req.json();

    console.log("Sending approval email to:", email);
    const emailResponse = await resend.emails.send({
      from: "Colimero <no-reply@colimero.com>",
      to: [email],
      subject: "Votre compte transporteur a été approuvé",
      html: `
        <h1>Félicitations ${company_name} !</h1>
        <p>Votre demande d'inscription en tant que transporteur a été approuvée.</p>
        <p>Vous pouvez maintenant vous connecter à votre compte et commencer à créer vos tournées.</p>
        <p>Cordialement,<br>L'équipe Colimero</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-approval-email function:", error);
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