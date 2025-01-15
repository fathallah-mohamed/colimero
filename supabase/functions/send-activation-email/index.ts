import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface ActivationEmailRequest {
  email: string;
  first_name: string;
  activation_token: string;
}

const handler = async (req: Request): Promise<Response> => {
  try {
    // Handle CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Get the request data
    const { email, first_name, activation_token }: ActivationEmailRequest = await req.json();
    console.log("Sending activation email to:", email);

    const activationUrl = `${req.headers.get("origin")}/activation?token=${activation_token}`;

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Colimero <noreply@colimero.com>",
        to: [email],
        subject: "Activez votre compte Colimero",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background-color: #00B0F0;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  border-radius: 5px 5px 0 0;
                }
                .content {
                  padding: 20px;
                  background: #f9f9f9;
                  border: 1px solid #ddd;
                  border-radius: 0 0 5px 5px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #00B0F0;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 12px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Bienvenue sur Colimero !</h1>
              </div>
              <div class="content">
                <h2>Bonjour ${first_name},</h2>
                <p>Merci d'avoir créé votre compte sur Colimero. Pour commencer à utiliser nos services, veuillez activer votre compte en cliquant sur le bouton ci-dessous :</p>
                
                <div style="text-align: center;">
                  <a href="${activationUrl}" class="button">Activer mon compte</a>
                </div>

                <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
                <p style="word-break: break-all;">${activationUrl}</p>

                <p><strong>Important :</strong> Ce lien d'activation est valable pendant 24 heures.</p>

                <p>Si vous n'avez pas créé de compte sur Colimero, vous pouvez ignorer cet email.</p>
              </div>
              <div class="footer">
                <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                <p>© 2024 Colimero. Tous droits réservés.</p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending email:", error);
      throw new Error("Failed to send activation email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-activation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

Deno.serve(handler);