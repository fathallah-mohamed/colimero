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

    return {
      exists: !!data,
      status: data?.status ?? 'pending',
      isVerified: data?.email_verified ?? false
    };
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Starting carrier sign in process for:', email);
      
      const status = await this.checkCarrierStatus(email);
      
      if (!status.exists) {
        return {
          success: false,
          error: "Ce compte n'est pas un compte transporteur"
        };
      }

      if (status.status !== 'active') {
        return {
          success: false,
          error: "Votre compte est en attente de validation par un administrateur",
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