import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseCarrierLoginProps {
  onSuccess?: () => void;
}

export function useCarrierLogin({ onSuccess }: UseCarrierLoginProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    console.log('Starting carrier login process for:', email);
    setIsLoading(true);
    setError(null);

    try {
      // 1. Vérifier le statut du transporteur
      const { data: carrierData, error: carrierError } = await supabase
        .from('carriers')
        .select('status')
        .eq('email', email.trim())
        .maybeSingle();

      console.log('Carrier status check result:', carrierData);

      if (carrierError) {
        console.error('Error checking carrier status:', carrierError);
        throw new Error("Une erreur est survenue lors de la vérification du compte");
      }

      // 2. Vérifier si le transporteur existe et est actif
      if (!carrierData || carrierData.status !== 'active') {
        console.log('Carrier not active or not found:', email);
        throw new Error(
          !carrierData 
            ? "Compte transporteur non trouvé" 
            : carrierData.status === 'pending'
              ? "Votre compte est en attente de validation par un administrateur"
              : "Votre compte n'est pas actif. Veuillez contacter l'administrateur"
        );
      }

      // 3. Si le transporteur est actif, procéder à la connexion
      console.log('Carrier active, proceeding with login');
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw new Error(signInError.message === "Invalid login credentials" 
          ? "Email ou mot de passe incorrect"
          : "Une erreur est survenue lors de la connexion"
        );
      }

      if (!authData.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      console.log('Login successful');
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message
      });
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