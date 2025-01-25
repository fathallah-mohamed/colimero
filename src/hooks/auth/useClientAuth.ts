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
      console.log("Attempting login for:", email);
      
      // First check if the client exists and isn't verified
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status, activation_code')
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

      // If client exists but isn't verified or is pending
      if (clientData && (!clientData.email_verified || clientData.status === 'pending')) {
        console.log("Client needs verification, sending activation email");
        setState(prev => ({ ...prev, isVerificationNeeded: true }));
        await handleResendActivation(email);
        return;
      }

      // Attempt to sign in
      console.log("Attempting sign in with auth");
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

      console.log("Login successful");
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace client",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        const returnPath = sessionStorage.getItem('returnPath');
        if (returnPath) {
          sessionStorage.removeItem('returnPath');
          navigate(returnPath);
        } else {
          navigate('/');
        }
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
      console.log("Resending activation email to:", email);
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { 
          email: email.trim(),
          resend: true
        }
      });

      if (error) {
        console.error("Error sending activation email:", error);
        throw error;
      }

      console.log("Activation email sent successfully");
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