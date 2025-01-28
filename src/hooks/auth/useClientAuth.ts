import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseClientAuthProps {
  onSuccess?: () => void;
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

      // First, check client status before attempting login
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
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
        
        // Attempt login to get the session
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (signInError) {
          console.error("Sign in error:", signInError);
          setError("Email ou mot de passe incorrect");
          return;
        }

        // If login successful but account not verified, sign out and redirect
        await supabase.auth.signOut();
        navigate('/activation-compte', { replace: true });
        return;
      }

      // If account is verified, proceed with normal login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError("Email ou mot de passe incorrect");
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
      await supabase.auth.signOut();
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