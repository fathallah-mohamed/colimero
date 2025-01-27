import { supabase } from "@/integrations/supabase/client";
import { VerificationResult } from "@/types/verification";

export const verificationService = {
  async verifyClientStatus(email: string) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      if (error) throw error;

      return {
        isVerified: data?.email_verified ?? false,
        error: undefined
      };
    } catch (error) {
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

      if (error) {
        return {
          success: false,
          error: "Code d'activation invalide"
        };
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error in activateAccount:', error);
      return {
        success: false,
        error: "Une erreur est survenue lors de l'activation"
      };
    }
  },

  async resendActivationEmail(email: string): Promise<VerificationResult> {
    try {
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { 
          email: email.trim(),
          resend: true
        }
      });

      if (error) {
        console.error("Error sending activation email:", error);
        return {
          success: false,
          error: "Impossible d'envoyer l'email d'activation"
        };
      }

      return {
        success: true
      };
    } catch (error) {
      console.error("Error in resendActivationEmail:", error);
      return {
        success: false,
        error: "Une erreur est survenue lors de l'envoi"
      };
    }
  }
};