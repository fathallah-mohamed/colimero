import { supabase } from "@/integrations/supabase/client";

interface VerificationResult {
  success?: boolean;
  error?: string;
}

export const authVerificationService = {
  async checkEmailVerification(email: string, userType: string): Promise<VerificationResult> {
    if (userType === 'client') {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .single();

      if (clientError) {
        console.error("Error checking client verification:", clientError);
        return { error: "Une erreur est survenue lors de la vérification de votre compte." };
      }

      if (!clientData?.email_verified) {
        return { error: "Veuillez activer votre compte via le lien envoyé par email avant de vous connecter." };
      }
    }

    return { success: true };
  },

  async validateUserType(user: any, requiredUserType?: 'client' | 'carrier'): Promise<VerificationResult> {
    if (!requiredUserType) return { success: true };

    const userType = user.user_metadata?.user_type;
    if (userType !== requiredUserType) {
      await supabase.auth.signOut();
      return {
        error: `Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`
      };
    }

    return { success: true };
  }
};