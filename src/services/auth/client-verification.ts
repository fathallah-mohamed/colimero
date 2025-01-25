import { supabase } from "@/integrations/supabase/client";

export const clientVerificationService = {
  async checkVerificationStatus(email: string) {
    try {
      console.log('Checking verification status for:', email);
      const { data: clientData, error } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error checking client status:', error);
        throw error;
      }

      console.log('Client verification data:', clientData);
      
      // Si aucune donnée n'est trouvée, considérer comme non vérifié
      if (!clientData) {
        return {
          email_verified: false
        };
      }

      return clientData;
    } catch (error) {
      console.error('Error checking verification status:', error);
      // En cas d'erreur, par sécurité on considère le compte comme non vérifié
      return {
        email_verified: false
      };
    }
  },

  async sendActivationEmail(email: string) {
    try {
      console.log('Sending activation email to:', email);
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (error) {
        console.error('Error sending activation email:', error);
        return false;
      }

      console.log('Activation email sent successfully');
      return true;
    } catch (error) {
      console.error('Error in sendActivationEmail:', error);
      return false;
    }
  }
};