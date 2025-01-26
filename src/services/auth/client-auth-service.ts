import { supabase } from "@/integrations/supabase/client";

interface ActivationResult {
  success: boolean;
  error?: string;
}

export const clientAuthService = {
  async activateAccount(activationCode: string, email: string): Promise<ActivationResult> {
    try {
      console.log('Activating account with code:', activationCode);
      
      const { data, error } = await supabase
        .rpc('activate_client_account', {
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
  }
};