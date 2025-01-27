import { useState } from "react";
import { clientAuthService } from "@/services/auth/client-auth-service";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface UseClientAuthProps {
  onSuccess?: () => void;
  onVerificationNeeded?: () => void;
}

export function useClientAuth({ onSuccess, onVerificationNeeded }: UseClientAuthProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationNeeded, setIsVerificationNeeded] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsVerificationNeeded(false);

      const result = await clientAuthService.signIn(email, password);

      if (!result.success) {
        if (result.needsVerification) {
          setIsVerificationNeeded(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          toast({
            variant: "destructive",
            title: "Compte non activé",
            description: "Votre compte n'est pas encore activé. Veuillez vérifier vos emails ou demander un nouveau code d'activation.",
          });
          return;
        }
        
        setError(result.error);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: result.error,
        });
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Une erreur inattendue s'est produite");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de la connexion",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendActivation = async (email: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { 
          email: email.trim(),
          resend: true
        }
      });

      if (error) {
        console.error("Error sending activation email:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'envoyer l'email d'activation. Veuillez réessayer."
        });
        return false;
      }

      toast({
        title: "Email envoyé",
        description: "Un nouvel email d'activation vous a été envoyé. Veuillez vérifier votre boîte de réception."
      });
      return true;
    } catch (error) {
      console.error("Error in handleResendActivation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email d'activation"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    isVerificationNeeded,
    handleLogin,
    handleResendActivation
  };
}