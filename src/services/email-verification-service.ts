import { supabase } from "@/integrations/supabase/client";

export interface EmailVerificationStatus {
  isVerified: boolean;
  email: string | null;
}

export const emailVerificationService = {
  async checkEmailVerification(email: string): Promise<EmailVerificationStatus> {
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('email_verified')
      .eq('email', email.trim())
      .maybeSingle();

    if (clientError) {
      console.error("Error checking client status:", clientError);
      throw new Error("Une erreur est survenue lors de la vérification de votre compte.");
    }

    return {
      isVerified: clientData?.email_verified ?? true,
      email: email
    };
  }
};