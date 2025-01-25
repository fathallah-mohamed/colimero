import { useState } from "react";
import { emailVerificationService } from "@/services/auth/email-verification-service";
import { useToast } from "@/hooks/use-toast";

export function useEmailVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const verifyEmail = async (email: string): Promise<boolean> => {
    setIsVerifying(true);
    try {
      const result = await emailVerificationService.verifyClientEmail(email);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Erreur de vérification",
          description: result.error
        });
        return false;
      }

      if (!result.isVerified) {
        toast({
          variant: "destructive",
          title: "Compte non vérifié",
          description: "Veuillez activer votre compte via le lien envoyé par email."
        });
      }

      return result.isVerified;
    } catch (error) {
      console.error('Error in verifyEmail:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification"
      });
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
      
      if (!result) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'envoyer le lien d'activation"
        });
        return false;
      }

      toast({
        title: "Email envoyé",
        description: "Un nouveau lien d'activation vous a été envoyé par email"
      });
      return true;
    } catch (error) {
      console.error('Error resending activation email:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email"
      });
      return false;
    } finally {
      setIsResending(false);
    }
  };

  return {
    isVerifying,
    isResending,
    verifyEmail,
    resendActivationEmail
  };
}