import { supabase } from "@/integrations/supabase/client";

interface AuthResult {
  success: boolean;
  error?: string;
  needsValidation?: boolean;
}

export const carrierAuthService = {
  async checkCarrierStatus(email: string) {
    console.log('Checking carrier status for:', email);
    const { data: carrierData, error } = await supabase
      .from('carriers')
      .select('email_verified, status')
      .eq('email', email.trim())
      .maybeSingle();

    if (error) {
      console.error("Error checking carrier status:", error);
      throw error;
    }

    return {
      exists: !!carrierData,
      isVerified: carrierData?.email_verified ?? false,
      status: carrierData?.status ?? 'pending'
    };
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Attempting carrier login for:', email);
      
      const carrierStatus = await this.checkCarrierStatus(email);
      
      if (!carrierStatus.exists) {
        return {
          success: false,
          error: "Ce compte n'est pas un compte transporteur"
        };
      }

      if (!carrierStatus.isVerified || carrierStatus.status !== 'active') {
        return {
          success: false,
          error: "Votre compte est en attente de validation par un administrateur",
          needsValidation: true
        };
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error("Carrier sign in error:", signInError);
        return {
          success: false,
          error: "Email ou mot de passe incorrect"
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
};