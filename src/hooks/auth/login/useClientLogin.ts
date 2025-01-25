import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseClientLoginProps {
  onSuccess?: () => void;
  onVerificationNeeded?: () => void;
}

export function useClientLogin({ onSuccess, onVerificationNeeded }: UseClientLoginProps = {}) {
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
        // Ne pas afficher d'erreur si c'est un problème de vérification d'email
        if (signInError.message === "Email not confirmed") {
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          return;
        }

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

      // Vérifier le statut de vérification du client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('id', user.id)
        .single();

      if (clientError) {
        setError("Erreur lors de la vérification du compte client");
        return;
      }

      if (!clientData?.email_verified) {
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace personnel",
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