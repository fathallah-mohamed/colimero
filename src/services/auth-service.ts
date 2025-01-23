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
      
      // Vérifier d'abord si c'est un transporteur
      const { data: carrierData, error: carrierError } = await supabase
        .from('carriers')
        .select('status, email')
        .eq('email', email.trim())
        .maybeSingle();

      console.log("Carrier check result:", { carrierData, carrierError });

      if (carrierError && carrierError.code !== 'PGRST116') {
        console.error("Error checking carrier status:", carrierError);
        return {
          success: false,
          error: "Une erreur est survenue lors de la vérification de votre compte."
        };
      }

      // Si c'est un transporteur, vérifier son statut avant d'autoriser la connexion
      if (carrierData) {
        console.log("Found carrier with status:", carrierData.status);
        
        if (carrierData.status !== 'active') {
          const errorMessages = {
            pending: "Votre compte est en attente de validation par Colimero. Vous recevrez un email une fois votre compte validé.",
            rejected: "Votre demande d'inscription a été rejetée. Vous ne pouvez pas vous connecter.",
            default: "Votre compte n'est pas actif. Veuillez contacter l'administrateur."
          };

          return {
            success: false,
            error: errorMessages[carrierData.status as keyof typeof errorMessages] || errorMessages.default
          };
        }
      }

      // Vérifier si c'est un client qui a besoin de vérification
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

      // Tentative de connexion
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

      // Double vérification du statut du transporteur après la connexion réussie
      if (carrierData) {
        const { data: finalCheck, error: finalCheckError } = await supabase
          .from('carriers')
          .select('status')
          .eq('email', email.trim())
          .single();

        if (finalCheckError || !finalCheck) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: "Vous n'avez pas les autorisations nécessaires pour vous connecter en tant que transporteur."
          };
        }

        if (finalCheck.status !== 'active') {
          await supabase.auth.signOut();
          return {
            success: false,
            error: "Votre compte n'est pas actif. Veuillez attendre la validation de votre compte."
          };
        }
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