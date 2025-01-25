import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log("Checking client verification status for:", email);

      // First check if the client exists and is verified
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .single();

      console.log("Client data:", clientData);
      console.log("Client error:", clientError);

      if (clientError) {
        if (clientError.code === 'PGRST116') {
          console.log("No client found with this email");
          throw new Error("Email ou mot de passe incorrect");
        }
        console.error("Error checking client status:", clientError);
        throw new Error("Une erreur est survenue lors de la vérification de votre compte");
      }

      // If client exists but isn't verified
      if (clientData && !clientData.email_verified) {
        console.log("Client needs verification, sending activation email");
        setState(prev => ({ ...prev, isVerificationNeeded: true }));
        await handleResendActivation(email);
        return;
      }

      // Proceed with login only if client is verified
      if (clientData && clientData.email_verified) {
        console.log("Client is verified, proceeding with login");
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (signInError) {
          console.error("Sign in error:", signInError);
          if (signInError.message.includes("Invalid login credentials")) {
            throw new Error("Email ou mot de passe incorrect");
          }
          throw new Error("Une erreur est survenue lors de la connexion");
        }

        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.log("Client verification status is false");
        setState(prev => ({ ...prev, isVerificationNeeded: true }));
        await handleResendActivation(email);
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setState(prev => ({
        ...prev,
        error: error.message || "Une erreur est survenue lors de la connexion"
      }));
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue lors de la connexion"
      });
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