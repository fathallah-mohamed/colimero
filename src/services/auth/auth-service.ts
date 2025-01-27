import { supabase } from "@/integrations/supabase/client";
import { UserType } from "@/types/auth";

interface AuthResult {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
  user?: any;
}

export const authService = {
  async checkClientVerification(email: string) {
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('email_verified, status, activation_code, activation_expires_at')
      .eq('email', email.trim())
      .maybeSingle();

    if (clientError) {
      console.error('Error checking client status:', clientError);
      throw new Error("Erreur lors de la vérification du compte");
    }

    return clientData;
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
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
        error: "Une erreur inattendue s'est produite"
      };
    }
  },

  async handleUserTypeValidation(user: any, requiredUserType?: UserType) {
    if (!requiredUserType) return { success: true };

    const userType = user.user_metadata?.user_type;
    if (userType !== requiredUserType) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: `Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : requiredUserType === 'carrier' ? 'transporteur' : 'administrateur'}`
      };
    }

    return { success: true };
  }
};