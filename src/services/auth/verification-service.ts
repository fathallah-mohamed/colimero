import { supabase } from "@/integrations/supabase/client";

interface VerificationResult {
  success: boolean;
  error?: string;
}

export const verificationService = {
  async activateAccount(activationCode: string, email: string): Promise<VerificationResult> {
    try {
      console.log('Activating account with code:', activationCode);
      
      const { data, error } = await supabase.rpc('activate_client_account', {
        p_activation_code: activationCode
      });

      if (error) {
        console.error('Error activating account:', error);
        return {
          success: false,
          error: "Code d'activation invalide ou expiré"
        };
      }

      if (!data) {
        return {
          success: false,
          error: "Code d'activation invalide"
        };
      }

      // Try to sign in after activation
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: activationCode // Use activation code as temporary password
      });

      if (signInError) {
        console.error('Error signing in after activation:', signInError);
        return {
          success: false,
          error: "Erreur lors de la connexion après activation"
        };
      }

      return { success: true };
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
      console.log('Requesting new activation email for:', email);
      
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (error) {
        console.error('Error sending activation email:', error);
        return {
          success: false,
          error: "Impossible d'envoyer l'email d'activation"
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in resendActivationEmail:', error);
      return {
        success: false,
        error: "Une erreur est survenue lors de l'envoi"
      };
    }
  }
};