import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClientAuthState {
  isLoading: boolean;
  error: string | null;
  isVerificationNeeded: boolean;
}

export function useClientAuth(onSuccess?: () => void) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<ClientAuthState>({
    isLoading: false,
    error: null,
    isVerificationNeeded: false
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // First check if the client exists and is verified
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .single();

      if (clientError) {
        console.error("Error checking client status:", clientError);
        throw new Error("Une erreur est survenue lors de la vérification de votre compte");
      }

      // If client exists but isn't verified
      if (clientData && (!clientData.email_verified || clientData.status === 'pending')) {
        setState(prev => ({ ...prev, isVerificationNeeded: true }));
        await handleResendActivation(email);
        return;
      }

      // Attempt to sign in
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

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace client",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
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

  const handleResendActivation = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { 
          email: email.trim(),
          resend: true
        }
      });

      if (error) throw error;

      toast({
        title: "Code d'activation envoyé",
        description: "Veuillez vérifier votre boîte mail pour activer votre compte",
      });
    } catch (error: any) {
      console.error("Error resending activation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le code d'activation"
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