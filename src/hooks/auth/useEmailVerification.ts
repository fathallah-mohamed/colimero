import { useState } from "react";
import { emailVerificationService } from "@/services/auth/email-verification-service";

export function useEmailVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const verifyEmail = async (email: string): Promise<boolean> => {
    setIsVerifying(true);
    try {
      const result = await emailVerificationService.verifyClientEmail(email);
      
      if (result.error) {
        return false;
      }

      return result.isVerified;
    } catch (error) {
      console.error('Error in verifyEmail:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const resendActivationEmail = async (email: string): Promise<boolean> => {
    console.log('Resending activation email to:', email);
    setIsResending(true);
    try {
      const result = await emailVerificationService.resendActivationEmail(email);
      
      if (result) {
        setShowConfirmationDialog(true);
      }
      return result;
    } catch (error) {
      console.error('Error resending activation email:', error);
      return false;
    } finally {
      setIsResending(false);
    }
  };

  return {
    isVerifying,
    isResending,
    showConfirmationDialog,
    setShowConfirmationDialog,
    verifyEmail,
    resendActivationEmail
  };
}