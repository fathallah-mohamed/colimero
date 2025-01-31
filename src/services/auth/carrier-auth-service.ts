import { BaseAuthService, AuthResult } from "./base-auth-service";
import { supabase } from "@/integrations/supabase/client";

class CarrierAuthService extends BaseAuthService {
  async checkCarrierStatus(email: string) {
    console.log('Checking carrier status for:', email);
    const { data, error } = await supabase
      .from('carriers')
      .select('status, email_verified')
      .eq('email', email.trim())
      .maybeSingle();

    if (error) {
      console.error("Error checking carrier status:", error);
      throw error;
    }

    console.log('Carrier status data:', data);

    return {
      exists: !!data,
      status: data?.status ?? 'pending',
      isVerified: data?.email_verified ?? false
    };
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Starting carrier sign in process for:', email);
      
      // Vérifier d'abord le statut du transporteur
      const status = await this.checkCarrierStatus(email);
      console.log('Carrier status check result:', status);
      
      if (!status.exists) {
        return {
          success: false,
          error: "Ce compte n'est pas un compte transporteur"
        };
      }

      // Bloquer la connexion si le statut n'est pas 'active', peu importe si l'email est vérifié
      if (status.status !== 'active') {
        return {
          success: false,
          error: "Votre compte est en attente de validation par un administrateur. Vous recevrez un email une fois votre compte validé.",
          needsValidation: true
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

      console.log('Carrier login successful');
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during carrier login:', error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite"
      };
    }
  }
}

export const carrierAuthService = new CarrierAuthService();