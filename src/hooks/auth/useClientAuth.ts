import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useClientVerification } from "./useClientVerification";

interface UseClientAuthProps {
  onSuccess?: () => void;
  onVerificationNeeded?: () => void;
}

export function useClientAuth({ onSuccess }: UseClientAuthProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkClientStatus } = useClientVerification();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);

      // Check client status before attempting login
      const clientStatus = await checkClientStatus(email);
      console.log('Client status:', clientStatus);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError("Email ou mot de passe incorrect");
        return;
      }

      if (!clientStatus.isVerified || clientStatus.status !== 'active') {
        console.log('Account needs verification, redirecting to activation page');
        navigate('/activation-compte');
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error('Unexpected error during login:', error);
      setError("Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleLogin
  };
}