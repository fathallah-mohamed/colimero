import { BaseAuthService, AuthResult } from "./base-auth-service";
import { supabase } from "@/integrations/supabase/client";

class ClientAuthService extends BaseAuthService {
  async checkClientStatus(email: string) {
    console.log('Checking client status for:', email);
    const { data, error } = await supabase
      .from('clients')
      .select('email_verified, status')
      .eq('email', email.trim())
      .maybeSingle();

    if (error) {
      console.error("Error checking client status:", error);
      throw error;
    }

    return {
      exists: !!data,
      isVerified: data?.email_verified ?? false,
      status: data?.status ?? 'pending'
    };
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Starting client sign in process for:', email);
      
      const status = await this.checkClientStatus(email);
      
      if (!status.exists) {
        return {
          success: false,
          error: "Aucun compte client trouvé avec cet email"
        };
      }

      if (!status.isVerified || status.status !== 'active') {
        return {
          success: false,
          error: "Votre compte n'est pas activé. Veuillez vérifier votre email.",
          needsVerification: true
        };
      }

      const { data, error } = await this.signInWithEmail(email, password);

      if (error) {
        return this.handleAuthError(error);
      }

      if (!data.user) {
        return {
          success: false,
          error: "Erreur lors de la connexion"
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Unexpected error during client login:', error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite"
      };
    }
  }

  async activateAccount(activationCode: string, email: string): Promise<AuthResult> {
    try {
      console.log('Attempting to activate account with code:', activationCode);
      
      const { data, error } = await supabase
        .rpc('activate_client_account', {
          p_activation_code: activationCode
        });

      if (error) {
        console.error('Error activating account:', error);
        return {
          success: false,
          error: "Code d'activation invalide"
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
  }
}

export const clientAuthService = new ClientAuthService();