import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useEmailVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
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

  return {
    verifyEmail,
    isVerifying,
    showConfirmationDialog,
    setShowConfirmationDialog
  };
}