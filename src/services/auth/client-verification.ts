import { supabase } from "@/integrations/supabase/client";

export const clientVerificationService = {
  async checkVerificationStatus(email: string) {
    const { data: clientData } = await supabase
      .from('clients')
      .select('email_verified')
      .eq('email', email.trim())
      .maybeSingle();
    
    return clientData;
  }
};