import { supabase } from "@/integrations/supabase/client";

interface AuthResult {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}

export const clientAuthService = {
  async checkClientStatus(email: string) {
    console.log('Checking client status for:', email);
    const { data: clientData, error } = await supabase
      .from('clients')
      .select('email_verified, status')
      .eq('email', email.trim())
      .maybeSingle();

    if (error) {
      console.error("Error checking client status:", error);
      throw error;
    }

    return {
      exists: !!clientData,
      isVerified: clientData?.email_verified ?? false,
      status: clientData?.status ?? 'pending'
    };
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Checking client status for:', email);
      
      const clientStatus = await this.checkClientStatus(email);
      
      if (!clientStatus.exists) {
        return {
          success: false,
          error: "Aucun compte client trouvé avec cet email"
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
  }
};