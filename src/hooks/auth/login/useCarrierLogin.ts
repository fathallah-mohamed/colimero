import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseCarrierLoginProps {
  onSuccess?: () => void;
}

export function useCarrierLogin({ onSuccess }: UseCarrierLoginProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    console.log('Starting carrier login process for:', email);
    setIsLoading(true);
    setError(null);

    try {
      // 1. Vérifier si le transporteur existe et est actif
      const { data: carrierData, error: carrierError } = await supabase
        .from('carriers')
        .select('status')
        .eq('email', email.trim())
        .maybeSingle();

      if (carrierError) {
        console.error('Error checking carrier status:', carrierError);
        setError("Une erreur est survenue lors de la vérification du compte");
        return;
      }

      // 2. Si le transporteur n'existe pas ou n'est pas actif, bloquer la connexion
      if (!carrierData || carrierData.status !== 'active') {
        console.log('Carrier not active or not found:', email);
        setError("Votre compte n'est pas encore activé. Veuillez attendre l'approbation d'un administrateur.");
        return;
      }

      // 3. Si le transporteur est actif, procéder à la connexion
      console.log('Carrier active, proceeding with login');
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