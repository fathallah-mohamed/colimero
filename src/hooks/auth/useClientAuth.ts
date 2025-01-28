import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseClientAuthProps {
  onVerificationNeeded?: () => void;
}

export function useClientAuth({ onVerificationNeeded }: UseClientAuthProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      // Vérifier d'abord le statut du client
      const { isVerified, status } = await checkClientStatus(email);
      console.log('Client status:', { isVerified, status });

      if (!isVerified) {
        console.log('Account not verified, triggering verification flow');
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        return;
      }

      if (status !== 'active') {
        toast({
          variant: "destructive",
          title: "Compte non activé",
          description: "Votre compte n'est pas encore activé. Veuillez vérifier votre email."
        });
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

        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: signInError.message
        });
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });

    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin
  };
}