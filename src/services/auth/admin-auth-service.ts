import { supabase } from "@/integrations/supabase/client";

interface AuthResult {
  success: boolean;
  error?: string;
}

export const adminAuthService = {
  async checkAdminStatus(email: string) {
    console.log('Checking admin status for:', email);
    const { data: adminData, error } = await supabase
      .from('administrators')
      .select('id, email')
      .eq('email', email.trim())
      .maybeSingle();

    if (error) {
      console.error("Error checking admin status:", error);
      throw error;
    }

    return {
      isAdmin: !!adminData,
      error: null
    };
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Attempting admin login for:', email);
      
      const adminStatus = await this.checkAdminStatus(email);
      
      if (!adminStatus.isAdmin) {
        return {
          success: false,
          error: "Ce compte n'est pas un compte administrateur"
        };
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error("Admin sign in error:", signInError);
        return {
          success: false,
          error: "Email ou mot de passe incorrect"
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
};