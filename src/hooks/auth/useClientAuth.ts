import { useState } from "react";
import { clientAuthService } from "@/services/auth/client-auth-service";
import { verificationService } from "@/services/auth/verification-service";
import { useToast } from "@/hooks/use-toast";

interface UseClientAuthState {
  isLoading: boolean;
  error: string | null;
  isVerificationNeeded: boolean;
}

export function useClientAuth(onSuccess?: () => void) {
  const [state, setState] = useState<UseClientAuthState>({
    isLoading: false,
    error: null,
    isVerificationNeeded: false
  });
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: null,
        isVerificationNeeded: false 
      }));

      // Vérifier d'abord le statut du client
      const { isVerified, error: verificationError } = await verificationService.verifyClientStatus(email);

      if (verificationError) {
        setState(prev => ({
          ...prev,
          error: verificationError
        }));
        return;
      }

      // Si le compte n'est pas vérifié, bloquer la connexion
      if (!isVerified) {
        console.log("Account needs verification:", email);
        setState(prev => ({
          ...prev,
          isVerificationNeeded: true,
          error: "Votre compte n'est pas activé. Veuillez vérifier votre email."
        }));
        return;
      }

      // Si le compte est vérifié, procéder à la connexion
      const result = await clientAuthService.signIn(email, password);

      if (!result.success) {
        setState(prev => ({
          ...prev,
          error: result.error || "Une erreur est survenue"
        }));
        return;
      }

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setState(prev => ({
        ...prev,
        error: error.message || "Une erreur est survenue lors de la connexion"
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleResendActivation = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
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
          description: "Impossible d'envoyer l'email d'activation"
        });
        return false;
      }

      toast({
        title: "Email envoyé",
        description: "Un nouvel email d'activation vous a été envoyé"
      });
      return true;
    } catch (error) {
      console.error("Error in handleResendActivation:", error);
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...state,
    handleLogin,
    handleResendActivation
  };
}