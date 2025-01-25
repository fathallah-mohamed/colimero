import { supabase } from "@/integrations/supabase/client";

export const clientVerificationService = {
  async checkVerificationStatus(email: string) {
    try {
      console.log('Checking verification status for:', email);
      const { data: clientData, error } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error checking client status:', error);
        throw error;
      }

      console.log('Client verification data:', clientData);
      return clientData;
    } catch (error) {
      console.error('Error checking verification status:', error);
      return null;
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