import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId } = await req.json();

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

    // 1. Récupérer la demande
    const { data: request, error: requestError } = await supabaseAdmin
      .from('approval_requests')
      .select('*, user:clients(*)')
      .eq('id', requestId)
      .single();

    if (requestError) throw requestError;
    if (!request) throw new Error("Demande non trouvée");

    // 2. Mettre à jour le statut de la demande
    const { error: updateError } = await supabaseAdmin
      .from('approval_requests')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    // 3. Activer le compte client
    const { error: clientError } = await supabaseAdmin
      .from('clients')
      .update({ 
        status: 'active',
        is_activated: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', request.user_id);

    if (clientError) throw clientError;

    // 4. Envoyer un email de confirmation
    const { error: emailError } = await supabaseAdmin.functions.invoke("send-approval-email", {
      body: {
        email: request.user.email,
        company_name: request.user.company_name
      }
    });

    if (emailError) {
      console.error("Error sending approval email:", emailError);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in approve-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});