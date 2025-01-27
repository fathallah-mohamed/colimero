import { useState } from "react";
import { verificationService } from "@/services/auth/verification-service";
import { useToast } from "@/hooks/use-toast";

export function useVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const activateAccount = async (activationCode: string, email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await verificationService.activateAccount(activationCode, email);
      
      if (!result.success) {
        setError(result.error);
        return false;
      }

      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès",
      });

      return true;
    } catch (error) {
      console.error('Error in activateAccount:', error);
      setError("Une erreur est survenue lors de l'activation");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendActivationEmail = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await verificationService.resendActivationEmail(email);
      
      if (!result.success) {
        setError(result.error);
        return false;
      }

      toast({
        title: "Email envoyé",
        description: "Un nouveau code d'activation vous a été envoyé",
      });

      return true;
    } catch (error) {
      console.error('Error in resendActivationEmail:', error);
      setError("Une erreur est survenue lors de l'envoi");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    activateAccount,
    resendActivationEmail
  };
}