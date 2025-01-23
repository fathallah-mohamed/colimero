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
      console.log("Checking email verification status for:", email.trim());
      
      // Vérifier d'abord si le client existe et son statut de vérification
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientError) {
        console.error("Error checking client status:", clientError);
        return {
          success: false,
          error: "Une erreur est survenue lors de la vérification de votre compte."
        };
      }

      // Si c'est un client et que l'email n'est pas vérifié, bloquer immédiatement
      if (clientData && !clientData.email_verified) {
        console.log('Client account not verified:', email);
        return {
          success: false,
          needsVerification: true,
          email: email
        };
      }

      // Vérifier le statut du transporteur si applicable
      const { data: carrierData, error: carrierError } = await supabase
        .from('carriers')
        .select('status, email')
        .eq('email', email.trim())
        .maybeSingle();

      if (carrierError && carrierError.code !== 'PGRST116') {
        console.error("Error checking carrier status:", carrierError);
        return {
          success: false,
          error: "Une erreur est survenue lors de la vérification de votre compte."
        };
      }

      // Si c'est un transporteur, vérifier le statut avant d'autoriser la connexion
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

      // Si l'email est vérifié ou si c'est un transporteur actif, tenter la connexion
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