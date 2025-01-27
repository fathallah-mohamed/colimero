import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AuthResult {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}

export const clientAuthService = {
  async checkClientStatus(email: string) {
    try {
      console.log('Checking client status for:', email);
      const { data: clientData, error } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      if (error) {
        console.error("Error checking client status:", error);
        throw new Error("Une erreur est survenue lors de la vérification de votre compte");
      }

      return {
        isVerified: clientData?.email_verified ?? false,
        status: clientData?.status ?? 'pending',
        exists: clientData !== null
      };
    } catch (error) {
      console.error("Error in checkClientStatus:", error);
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Checking client status for:', email);
      
      // Check client status before attempting login
      const clientStatus = await this.checkClientStatus(email);
      
      if (!clientStatus.exists) {
        return {
          success: false,
          error: "Compte non trouvé"
        };
      }

      if (!clientStatus.isVerified || clientStatus.status !== 'active') {
        console.log("Account needs verification:", email);
        return {
          success: false,
          error: "Votre compte n'est pas activé. Veuillez vérifier votre email.",
          needsVerification: true
        };
      }

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