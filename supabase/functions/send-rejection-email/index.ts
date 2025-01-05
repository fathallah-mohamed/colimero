import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      throw new Error("Email service configuration is missing");
    }

    const { email, company_name, reason } = await req.json();
    console.log("Sending rejection email to:", email, "for company:", company_name);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Colimero <no-reply@colimero.fr>",
        to: [email],
        subject: "Votre demande d'inscription a été rejetée",
        html: `
          <h1>Bonjour ${company_name},</h1>
          <p>Nous sommes désolés de vous informer que votre demande d'inscription en tant que transporteur a été rejetée pour la raison suivante :</p>
          <p><em>${reason}</em></p>
          <p>Vous pouvez soumettre une nouvelle demande en tenant compte des remarques ci-dessus.</p>
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
    console.log("Email sent successfully:", data);
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-rejection-email function:", error);
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