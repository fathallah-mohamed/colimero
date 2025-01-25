import { useState } from "react";
import { emailVerificationService } from "@/services/auth/email-verification-service";
import { useToast } from "@/hooks/use-toast";

export function useEmailVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
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

  return {
    isVerifying,
    verifyEmail
  };
}