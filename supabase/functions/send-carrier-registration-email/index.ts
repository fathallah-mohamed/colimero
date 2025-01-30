import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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

    const { email, company_name, first_name, last_name }: RegistrationEmailData = await req.json();
    console.log("Sending registration confirmation email to:", email);

    const res = await fetch("https://api.resend.com/emails", {
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

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Error response from Resend:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const data = await res.json();
    console.log("Registration confirmation email sent successfully:", data);
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-carrier-registration-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while sending the email" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);