import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { emailVerificationService } from "@/services/email-verification-service";

export function useEmailVerificationState(email: string) {
  const [isResending, setIsResending] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      const success = await emailVerificationService.resendActivationEmail(email);
      
      if (success) {
        toast({
          title: "Email envoyé",
          description: "Un nouveau lien d'activation a été envoyé à votre adresse email.",
        });
      }
    } catch (error) {
      console.error('Error resending activation email:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return {
    isResending,
    showVerificationDialog,
    setShowVerificationDialog,
    handleResendEmail
  };
}