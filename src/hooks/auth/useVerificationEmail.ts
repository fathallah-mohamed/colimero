import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useVerificationEmail() {
  const [isResending, setIsResending] = useState(false);

  const sendVerificationEmail = async (email: string) => {
    if (!email?.trim()) {
      console.error('No email provided');
      return false;
    }

    console.log('Attempting to resend activation email to:', email);
    setIsResending(true);

    try {
      const { error } = await supabase.functions.invoke(
        'send-activation-email',
        {
          body: { 
            email: email.trim(),
            resend: true
          }
        }
      );

      if (error) {
        console.error('Error sending activation email:', error);
        return false;
      }

      console.log('Activation email sent successfully');
      return true;
    } catch (error) {
      console.error('Error in sendVerificationEmail:', error);
      return false;
    } finally {
      setIsResending(false);
    }
  };

  return {
    isResending,
    sendVerificationEmail
  };
}