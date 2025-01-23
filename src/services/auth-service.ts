import { supabase } from "@/integrations/supabase/client";
import { emailVerificationService } from "./email-verification-service";
import { carrierAuthService } from "./carrier-auth-service";

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
      
      // 1. Vérifier le statut de vérification de l'email pour les clients
      const verificationStatus = await emailVerificationService.checkEmailVerification(email);
      
      if (!verificationStatus.isVerified) {
        console.log('Client account not verified:', email);
        return {
          success: false,
          needsVerification: true,
          email: email
        };
      }

      // 2. Vérifier le statut du transporteur
      const carrierStatus = await carrierAuthService.checkCarrierStatus(email);
      if (!carrierStatus.isActive && carrierStatus.error) {
        return {
          success: false,
          error: carrierStatus.error
        };
      }

      // 3. Tenter la connexion
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