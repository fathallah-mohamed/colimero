import { supabase } from "@/integrations/supabase/client";
import { emailVerificationService } from "./email-verification-service";

export interface AuthResponse {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
  email?: string;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log("Starting authentication process for:", email.trim());
      
      // 1. Vérifier d'abord le statut de vérification
      const verificationStatus = await emailVerificationService.checkEmailVerification(email);
      console.log("Verification status:", verificationStatus);
      
      if (!verificationStatus.isVerified) {
        return {
          success: false,
          needsVerification: true,
          email: email
        };
      }

      // 2. Tenter la connexion uniquement si l'email est vérifié
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        return {
          success: false,
          error: "Email ou mot de passe incorrect"
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: "Aucune donnée utilisateur reçue"
        };
      }

      return { success: true };

    } catch (error: any) {
      console.error("Complete error:", error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite"
      };
    }
  },

  async signUp(email: string, password: string, userData: any): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            ...userData,
            user_type: 'client'
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          return {
            success: false,
            error: "Un compte existe déjà avec cet email"
          };
        }
        throw error;
      }

      if (!data.user) {
        return {
          success: false,
          error: "Erreur lors de la création du compte"
        };
      }

      return {
        success: true,
        email: email
      };

    } catch (error: any) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: error.message || "Une erreur est survenue lors de l'inscription"
      };
    }
  }
};