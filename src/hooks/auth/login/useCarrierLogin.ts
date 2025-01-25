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
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        setError(signInError.message === "Invalid login credentials" 
          ? "Email ou mot de passe incorrect"
          : "Une erreur est survenue lors de la connexion"
        );
        return;
      }

      if (!user) {
        setError("Aucune donnée utilisateur reçue");
        return;
      }

      // Vérifier le statut du transporteur
      const { data: carrierData, error: carrierError } = await supabase
        .from('carriers')
        .select('status')
        .eq('id', user.id)
        .single();

      if (carrierError) {
        setError("Erreur lors de la vérification du compte transporteur");
        await supabase.auth.signOut();
        return;
      }

      if (carrierData.status !== 'active') {
        setError("Votre compte transporteur n'est pas encore activé");
        await supabase.auth.signOut();
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace transporteur",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError("Une erreur inattendue s'est produite");
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