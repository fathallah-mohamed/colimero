import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

interface AuthResponse {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
  email?: string;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log("Attempting to sign in with email:", email.trim());
      
      // Vérifier d'abord si le compte est vérifié
      const { data: clientData } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientData && clientData.email_verified === false) {
        console.log('Account not verified:', email);
        return {
          success: false,
          needsVerification: true,
          email: email
        };
      }

      // Tenter la connexion
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (signInError.message === "Invalid login credentials") {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (signInError.message === "Email not confirmed") {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        }

        return {
          success: false,
          error: errorMessage
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: "Aucune donnée utilisateur reçue"
        };
      }

      console.log("Sign in successful for user:", data.user.id);
      return {
        success: true
      };

    } catch (error: any) {
      console.error("Complete error:", error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite"
      };
    }
  }
};