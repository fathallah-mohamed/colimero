import { useState } from "react";
import { clientAuthService } from "@/services/auth/client-auth-service";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const handleResendActivation = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      console.log("Resending activation email to:", email);
      
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

  const handleLogin = async (email: string, password: string) => {
    try {
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: null,
        isVerificationNeeded: false 
      }));

      // Check client status first
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status, activation_code')
        .eq('email', email.trim())
        .single();

      if (clientError) {
        console.error("Error checking client status:", clientError);
        setState(prev => ({
          ...prev,
          error: "Erreur lors de la vérification du compte"
        }));
        return;
      }

      // If account is not verified, show verification dialog
      if (!clientData?.email_verified || clientData.status !== 'active') {
        console.log("Account needs verification:", email);
        setState(prev => ({
          ...prev,
          isVerificationNeeded: true,
          error: "Votre compte n'est pas activé. Veuillez vérifier votre email."
        }));
        return;
      }

      // If account is verified, proceed with login
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

  return {
    ...state,
    handleLogin,
    handleResendActivation
  };
}