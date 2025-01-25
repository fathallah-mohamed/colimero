import { supabase } from "@/integrations/supabase/client";

export const clientVerificationService = {
  async checkVerificationStatus(email: string) {
    try {
      const { data: clientData, error } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email)
        .single();

      if (error) throw error;
      return clientData;
    } catch (error) {
      console.error('Error checking verification status:', error);
      return null;
    }
  },

  async sendActivationEmail(email: string) {
    try {
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (error) {
        console.error('Error sending activation email:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in sendActivationEmail:', error);
      return false;
    }
  }
};