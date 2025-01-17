import { supabase } from "@/integrations/supabase/client";

interface AuthResponse {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
  email?: string;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // 1. Vérifier si le compte est vérifié
      const { data: clientData } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientData && !clientData.email_verified) {
        return {
          success: false,
          needsVerification: true,
          email: email
        };
      }

      // 2. Tenter la connexion
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        return {
          success: false,
          error: signInError.message === "Invalid login credentials" 
            ? "Email ou mot de passe incorrect"
            : "Une erreur est survenue lors de la connexion"
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: "Aucune donnée utilisateur reçue"
        };
      }

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