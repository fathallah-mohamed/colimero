import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  email: string;
  firstName?: string;
  activationCode: string;
  resend?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting send-activation-email function');
    const requestData = await req.json();
    console.log('Received request data:', requestData);

    const { email, firstName, activationCode, resend = false } = requestData as EmailRequest;
    console.log('Sending activation email to:', email, 'with code:', activationCode);

    if (!email || !activationCode) {
      throw new Error('Missing required fields: email or activationCode');
    }

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Colimero <no-reply@colimero.com>',
      to: email.trim(),
      subject: resend ? 'Nouveau code d\'activation Colimero' : 'Activez votre compte Colimero',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d; text-align: center;">Bienvenue ${firstName || ''}!</h2>
          <p style="color: #4a5568; text-align: center;">
            ${resend ? 'Voici votre nouveau code d\'activation' : 'Merci de vous être inscrit sur Colimero'}. Pour activer votre compte, veuillez utiliser le code suivant :
          </p>
          <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="font-size: 24px; letter-spacing: 5px; margin: 0; color: #2d3748;">
              ${activationCode}
            </h3>
          </div>
          <p style="color: #718096; text-align: center; font-size: 14px;">
            Ce code est valable pendant 48 heures. Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.
          </p>
        </div>
      `
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      throw emailError;
    }

    console.log('Email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Complete error in send-activation-email:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
};

serve(handler);