import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ClientAuthState {
  isLoading: boolean;
  statusMessage: { type: 'default' | 'destructive'; message: string } | null;
}

export function useClientAuth(onSuccess?: () => void) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<ClientAuthState>({
    isLoading: false,
    statusMessage: null,
  });

  const checkClientVerification = async (email: string) => {
    console.log("Checking verification status for:", email);
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('status')
      .eq('email', email.trim())
      .single();

    if (clientError) {
      console.error("Error checking client status:", clientError);
      return { error: "Une erreur est survenue lors de la vérification de votre compte." };
    }

    if (clientData && clientData.status !== 'active') {
      return { error: "Veuillez activer votre compte via le code envoyé par email avant de vous connecter." };
    }

    return { success: true };
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, statusMessage: null }));

      const verificationCheck = await checkClientVerification(email);
      if ('error' in verificationCheck) {
        setState(prev => ({
          ...prev,
          statusMessage: { type: 'default', message: verificationCheck.error }
        }));
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setState(prev => ({
          ...prev,
          statusMessage: {
            type: 'destructive',
            message: signInError.message === "Invalid login credentials"
              ? "Email ou mot de passe incorrect"
              : "Une erreur est survenue lors de la connexion"
          }
        }));
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setState(prev => ({
        ...prev,
        statusMessage: {
          type: 'destructive',
          message: "Une erreur est survenue lors de la connexion"
        }
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleResendActivation = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { email, resend: true }
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Un nouveau code d'activation vous a été envoyé par email.",
      });
    } catch (error: any) {
      console.error("Error resending activation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le code d'activation. Veuillez réessayer.",
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...state,
    handleLogin,
    handleResendActivation,
  };
}