import { supabase } from "@/integrations/supabase/client";

export interface EmailVerificationResult {
  isVerified: boolean;
  email: string | null;
  error?: string;
}

export const emailVerificationService = {
  async verifyClientEmail(email: string): Promise<EmailVerificationResult> {
    try {
      console.log('Verifying client email:', email);
      
      const { data: clientData, error } = await supabase
        .from('clients')
        .select('email_verified, email')
        .eq('email', email.trim())
        .maybeSingle();

      if (error) {
        console.error('Error verifying client email:', error);
        return {
          isVerified: false,
          email: email,
          error: 'Une erreur est survenue lors de la vérification'
        };
      }

      // Si aucun client trouvé, considérer comme non vérifié
      if (!clientData) {
        console.log('No client found for email:', email);
        return {
          isVerified: false,
          email: email
        };
      }

      console.log('Client verification result:', clientData);
      return {
        isVerified: !!clientData.email_verified,
        email: clientData.email
      };
    } catch (error) {
      console.error('Unexpected error during email verification:', error);
      return {
        isVerified: false,
        email: email,
        error: 'Une erreur inattendue est survenue'
      };
    }
  },

  async handleVerificationCheck(email: string): Promise<boolean> {
    const result = await this.verifyClientEmail(email);
    return result.isVerified;
  }
};