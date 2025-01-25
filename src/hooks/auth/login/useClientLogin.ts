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
      // Vérifier d'abord si le client existe et n'est pas vérifié
      const { data: clientData } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .single();

      if (clientData && !clientData.email_verified) {
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setIsLoading(false);
        return;
      }

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

        // Pour les autres erreurs, on affiche un message approprié
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect");
        } else {
          setError("Une erreur est survenue lors de la connexion");
        }
        return;
      }

      if (!user) {
        setError("Aucune donnée utilisateur reçue");
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