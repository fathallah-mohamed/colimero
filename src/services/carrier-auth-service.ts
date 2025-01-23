import { supabase } from "@/integrations/supabase/client";

interface CarrierStatus {
  isActive: boolean;
  error?: string;
}

export const carrierAuthService = {
  async checkCarrierStatus(email: string): Promise<CarrierStatus> {
    const { data: carrierData, error: carrierError } = await supabase
      .from('carriers')
      .select('status, email')
      .eq('email', email.trim())
      .maybeSingle();

    if (carrierError && carrierError.code !== 'PGRST116') {
      console.error("Error checking carrier status:", carrierError);
      throw new Error("Une erreur est survenue lors de la vérification de votre compte.");
    }

    if (carrierData) {
      console.log("Found carrier with status:", carrierData.status);
      
      if (carrierData.status !== 'active') {
        const errorMessages: Record<string, string> = {
          pending: "Votre compte est en attente de validation par Colimero. Vous recevrez un email une fois votre compte validé.",
          rejected: "Votre demande d'inscription a été rejetée. Vous ne pouvez pas vous connecter.",
          default: "Votre compte n'est pas actif. Veuillez contacter l'administrateur."
        };

        return {
          isActive: false,
          error: errorMessages[carrierData.status] || errorMessages.default
        };
      }
    }

    return { isActive: true };
  }
};