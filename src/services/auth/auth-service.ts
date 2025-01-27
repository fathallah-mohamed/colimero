import { supabase } from "@/integrations/supabase/client";
import { UserType } from "@/types/auth";

interface AuthResult {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}

export const authService = {
  async signIn(email: string, password: string, requiredUserType?: UserType): Promise<AuthResult> {
    try {
      // Vérifier d'abord si c'est un client et s'il est vérifié
      if (!requiredUserType || requiredUserType === 'client') {
        const { data: clientData } = await supabase
          .from('clients')
          .select('email_verified, status')
          .eq('email', email.trim())
          .maybeSingle();

        if (clientData) {
          if (!clientData.email_verified || clientData.status !== 'active') {
            return {
              success: false,
              needsVerification: true,
              error: "Votre compte n'est pas activé. Veuillez vérifier votre email."
            };
          }
        }
      }

      // Tentative de connexion
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        return {
          success: false,
          error: signInError.message === "Invalid login credentials" 
            ? "Email ou mot de passe incorrect"
            : "Une erreur est survenue lors de la connexion"
        };
      }

      if (!user) {
        return {
          success: false,
          error: "Aucune donnée utilisateur reçue"
        };
      }

      // Vérifier le type d'utilisateur si requis
      if (requiredUserType) {
        const userType = user.user_metadata?.user_type;
        if (userType !== requiredUserType) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: `Ce compte n'est pas un compte ${
              requiredUserType === 'client' ? 'client' : 
              requiredUserType === 'carrier' ? 'transporteur' : 
              'administrateur'
            }`
          };
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite"
      };
    }
  }
};