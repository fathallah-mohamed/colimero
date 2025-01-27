import { supabase } from "@/integrations/supabase/client";

interface VerificationResult {
  success: boolean;
  error?: string;
}

export const verificationService = {
  async verifyClientStatus(email: string): Promise<{ isVerified: boolean; error?: string }> {
    try {
      const { data: client, error } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .single();

      if (error) throw error;

      return {
        isVerified: Boolean(client?.email_verified && client?.status === 'active')
      };
    } catch (error: any) {
      console.error('Error verifying client status:', error);
      return {
        isVerified: false,
        error: "Erreur lors de la vérification du statut"
      };
    }
  },

  async activateAccount(activationCode: string, email: string): Promise<VerificationResult> {
    try {
      const { data, error } = await supabase
        .rpc('activate_client_account', {
          p_activation_code: activationCode
        });

      if (error) throw error;

      if (!data) {
        return {
          success: false,
          error: "Code d'activation invalide"
        };
      }

      // Mettre à jour le statut du client
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          email_verified: true,
          status: 'active',
          activation_code: null,
          activation_expires_at: null
        })
        .eq('email', email);

      if (updateError) throw updateError;

      return { success: true };
    } catch (error: any) {
      console.error('Error in activateAccount:', error);
      return {
        success: false,
        error: "Une erreur est survenue lors de l'activation"
      };
    }
  }
};