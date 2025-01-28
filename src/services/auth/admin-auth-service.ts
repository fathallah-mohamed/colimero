import { BaseAuthService, AuthResult } from "./base-auth-service";
import { supabase } from "@/integrations/supabase/client";

class AdminAuthService extends BaseAuthService {
  async checkAdminStatus(email: string) {
    console.log('Checking admin status for:', email);
    const { data, error } = await supabase
      .from('administrators')
      .select('id, email')
      .eq('email', email.trim())
      .maybeSingle();

    if (error) {
      console.error("Error checking admin status:", error);
      throw error;
    }

    return {
      isAdmin: !!data
    };
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Starting admin sign in process for:', email);
      
      const status = await this.checkAdminStatus(email);
      
      if (!status.isAdmin) {
        return {
          success: false,
          error: "Ce compte n'est pas un compte administrateur"
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
      console.error('Unexpected error during admin login:', error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite"
      };
    }
  }
}

export const adminAuthService = new AdminAuthService();