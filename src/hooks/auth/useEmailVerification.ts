import { useState } from "react";
import { emailVerificationService } from "@/services/email-verification-service";
import { useToast } from "@/hooks/use-toast";

export function useEmailVerification() {
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const resendActivationEmail = async (email: string) => {
    setIsResending(true);
    try {
      const success = await emailVerificationService.resendActivationEmail(email);
      
      if (success) {
        toast({
          title: "Email envoyé",
          description: "Un nouveau lien d'activation a été envoyé à votre adresse email.",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi de l'email.",
        });
        return false;
      }
    } catch (error) {
      console.error('Error resending activation email:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email.",
      });
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