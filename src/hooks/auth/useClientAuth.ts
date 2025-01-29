import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseClientAuthProps {
  onVerificationNeeded?: () => void;
  onSuccess?: () => void;
}

export function useClientAuth({ onVerificationNeeded, onSuccess }: UseClientAuthProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkClientStatus = async (email: string) => {
    console.log('Checking client status for:', email);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email)
        .single();

      if (error) throw error;

      return {
        isVerified: data?.email_verified ?? false,
        status: data?.status ?? 'pending'
      };
    } catch (error) {
      console.error('Error checking client status:', error);
      return { isVerified: false, status: 'pending' };
    }
  };

  const handleLogin = async (email: string, password: string) => {
    console.log('Starting login process for:', email);
    setIsLoading(true);
    setError(null);

    try {
      // Vérifier d'abord le statut du client
      const { isVerified, status } = await checkClientStatus(email);
      console.log('Client status:', { isVerified, status });

      if (!isVerified || status !== 'active') {
        console.log('Account needs verification, triggering verification flow');
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        // Si l'erreur est "Email not confirmed", on déclenche la vérification
        if (signInError.message.includes('Email not confirmed')) {
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          return;
        }

        setError(signInError.message);
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });

      if (onSuccess) {
        onSuccess();
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