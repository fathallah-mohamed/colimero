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
      
      // 1. ALWAYS check email verification status first
      const verificationStatus = await emailVerificationService.checkEmailVerification(email);
      console.log("Verification status:", verificationStatus);
      
      if (!verificationStatus.isVerified) {
        console.log('Account not verified:', email);
        return {
          success: false,
          needsVerification: true,
          email: email
        };
      }

      // 2. Only attempt login if email is verified
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