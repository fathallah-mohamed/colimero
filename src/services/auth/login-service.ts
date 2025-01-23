import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

interface LoginResponse {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
  user?: any;
}

export const loginService = {
  async checkClientVerification(email: string) {
    const { data: clientData } = await supabase
      .from('clients')
      .select('email_verified')
      .eq('email', email.trim())
      .maybeSingle();
    
    return clientData;
  },

  async signIn(email: string, password: string): Promise<LoginResponse> {
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          return {
            success: false,
            error: "Email ou mot de passe incorrect"
          };
        }
        return {
          success: false,
          error: "Une erreur est survenue lors de la connexion"
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: "Aucune donnée utilisateur reçue"
        };
      }

      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error instanceof AuthError ? error.message : "Une erreur inattendue s'est produite"
      };
    }
  },

  async handleUserTypeValidation(user: any, requiredUserType?: 'client' | 'carrier') {
    if (!requiredUserType) return { success: true };

    const userType = user.user_metadata?.user_type;
    if (userType !== requiredUserType) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: `Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`
      };
    }

    return { success: true };
  }
};