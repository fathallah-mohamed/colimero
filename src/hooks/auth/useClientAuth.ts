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
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: null,
        isVerificationNeeded: false 
      }));

      // First check if the client exists and is verified
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .single();

      console.log("Client verification status:", clientData);

      // If client doesn't exist or there's an error checking
      if (clientError) {
        console.error("Error checking client status:", clientError);
        setState(prev => ({
          ...prev,
          error: "Email ou mot de passe incorrect"
        }));
        return;
      }

      // IMPORTANT: Block login if email is not verified
      if (!clientData?.email_verified) {
        console.log("Email not verified, blocking login");
        setState(prev => ({ 
          ...prev, 
          isVerificationNeeded: true,
          error: "Votre compte n'est pas activé. Veuillez vérifier votre email."
        }));
        await handleResendActivation(email);
        return;
      }

      // Only proceed with login if email is verified
      console.log("Email is verified, proceeding with login attempt");
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setState(prev => ({
          ...prev,
          error: "Email ou mot de passe incorrect"
        }));
        return;
      }

      // Login successful
      console.log("Login successful");
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