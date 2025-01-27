import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseClientAuthProps {
  onSuccess?: () => void;
  onVerificationNeeded?: () => void;
}

export function useClientAuth({ onSuccess }: UseClientAuthProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);

      // First, attempt login
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError("Email ou mot de passe incorrect");
        return;
      }

      if (!authData.user) {
        setError("Une erreur inattendue s'est produite");
        return;
      }

      // Then check client status
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('id', authData.user.id)
        .single();

      if (clientError) {
        console.error("Error checking client status:", clientError);
        setError("Erreur lors de la vérification du compte");
        return;
      }

      console.log('Client status:', clientData);

      // If client is not verified or not active, redirect to activation
      if (!clientData?.email_verified || clientData?.status !== 'active') {
        console.log('Account needs verification, redirecting to activation page');
        // Sign out the user since they shouldn't be logged in yet
        await supabase.auth.signOut();
        navigate('/activation-compte');
        return;
      }

      // If everything is good, show success toast and redirect
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