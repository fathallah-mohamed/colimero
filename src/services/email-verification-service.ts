import { supabase } from "@/integrations/supabase/client";

export interface EmailVerificationStatus {
  isVerified: boolean;
  email: string | null;
}

export const emailVerificationService = {
  async checkEmailVerification(email: string): Promise<EmailVerificationStatus> {
    try {
      console.log("Checking verification status for:", email);
      
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientError) {
        console.error("Error checking client status:", clientError);
        throw new Error("Une erreur est survenue lors de la vérification de votre compte.");
      }

      console.log("Client verification data:", clientData);

      return {
        isVerified: clientData?.email_verified ?? false,
        email: email
      };
    } catch (error) {
      console.error("Error in checkEmailVerification:", error);
      throw error;
    }
  },

  async resendActivationEmail(email: string): Promise<boolean> {
    try {
      console.log("Resending activation email to:", email);
      
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (error) {
        console.error("Error sending activation email:", error);
        return false;
      }

      console.log("Activation email sent successfully");
      return true;
    } catch (error) {
      console.error("Error in resendActivationEmail:", error);
      return false;
    }
  }
};