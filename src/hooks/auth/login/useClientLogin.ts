import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseClientLoginProps {
  onSuccess?: () => void;
  onVerificationNeeded?: () => void;
}

export function useClientLogin({ onSuccess, onVerificationNeeded }: UseClientLoginProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    console.log('Starting login process for:', email);
    setIsLoading(true);
    setError(null);

    try {
      // 1. Vérifier d'abord si le client existe et est vérifié
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .maybeSingle();

      console.log('Client verification check result:', clientData);

      if (clientError) {
        console.error('Error checking client verification:', clientError);
        setError("Une erreur est survenue lors de la vérification du compte");
        return;
      }

      // 2. Si le client n'existe pas ou n'est pas vérifié, bloquer la connexion
      if (!clientData || clientData.email_verified === false) {
        console.log('Account not verified or not found:', email);
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        return;
      }

      // 3. Si le client est vérifié, procéder à la connexion
      console.log('Account verified, proceeding with login');
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        setError(signInError.message === "Invalid login credentials" 
          ? "Email ou mot de passe incorrect"
          : "Une erreur est survenue lors de la connexion"
        );
        return;
      }

      if (!authData.user) {
        setError("Aucune donnée utilisateur reçue");
        return;
      }

      console.log('Login successful');
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleLogin,
  };
}