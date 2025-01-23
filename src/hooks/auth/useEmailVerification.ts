import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useEmailVerification() {
  const [isResending, setIsResending] = useState(false);

  const resendActivationEmail = async (email: string) => {
    setIsResending(true);
    try {
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error resending activation email:', error);
      return false;
    } finally {
      setIsResending(false);
    }
  };

  return {
    isResending,
    resendActivationEmail
  };
}