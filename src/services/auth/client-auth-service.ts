import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AuthResult {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}

export const clientAuthService = {
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Attempting login for:', email);
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        return {
          success: false,
          error: "Email ou mot de passe incorrect"
        };
      }

      return { success: true };

    } catch (error) {
      console.error('Unexpected error during login:', error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite"
      };
    }
  },

  async activateAccount(activationCode: string, email: string): Promise<AuthResult> {
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

      // Mettre à jour le statut dans la table clients
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          email_verified: true,
          status: 'active',
          activation_code: null,
          activation_expires_at: null
        })
        .eq('email', email);

      if (updateError) {
        console.error('Error updating client status:', updateError);
        return {
          success: false,
          error: "Erreur lors de la mise à jour du statut"
        };
      }

      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter."
      });

      return { success: true };
    } catch (error) {
      console.error('Error in activateAccount:', error);
      return {
        success: false,
        error: "Une erreur est survenue lors de l'activation"
      };
    }
  }
};