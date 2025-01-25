import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useEmailVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const verifyEmail = async (email: string) => {
    setIsVerifying(true);
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email)
        .single();

      return clientData?.email_verified || false;
    } catch (error) {
      console.error('Error verifying email:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const resendActivationEmail = async (email: string): Promise<boolean> => {
    console.log('Resending activation email to:', email);
    setIsResending(true);
    try {
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (!error) {
        setShowConfirmationDialog(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error resending activation email:', error);
      return false;
    } finally {
      setIsResending(false);
    }
  };

  return {
    verifyEmail,
    isVerifying,
    isResending,
    showConfirmationDialog,
    setShowConfirmationDialog,
    resendActivationEmail
  };
}