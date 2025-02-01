import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
    
    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service configuration is missing");
    }

    const resend = new Resend(resendApiKey);
    const { email, company_name }: EmailRequest = await req.json();

    console.log("Sending approval email to:", email);

    // Generate password setup link
    const setupPasswordLink = `${Deno.env.get('SITE_URL')}/setup-password?email=${encodeURIComponent(email)}`;

    const emailResponse = await resend.emails.send({
      from: "Colimero <no-reply@colimero.com>",
      to: [email],
      subject: "Votre compte transporteur a été approuvé",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Félicitations ${company_name} !</h1>
          <p>Votre demande d'inscription en tant que transporteur a été approuvée.</p>
          <p>Pour finaliser votre inscription et accéder à votre compte, vous devez configurer votre mot de passe :</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${setupPasswordLink}" 
               style="background-color: #00B0F0; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 4px;
                      display: inline-block;">
              Configurer mon mot de passe
            </a>
          </div>
          
          <p>Ce lien est valable pendant 24 heures. Si vous ne configurez pas votre mot de passe dans ce délai, 
             vous devrez contacter notre support.</p>
          
          <p>Une fois votre mot de passe configuré, vous pourrez vous connecter à votre compte et commencer 
             à créer vos tournées.</p>
          
          <p>Cordialement,<br>L'équipe Colimero</p>
        </div>
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