import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseAdminLoginProps {
  onSuccess?: () => void;
}

export function useAdminLogin({ onSuccess }: UseAdminLoginProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
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

      if (!authData.user) {
        setError("Aucune donnée utilisateur reçue");
        return;
      }

      // Vérifier si l'utilisateur est un administrateur
      const { data: adminData, error: adminError } = await supabase
        .from('administrators')
        .select('id')
        .eq('id', authData.user.id)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        setError("Vous n'avez pas les droits d'administrateur");
        return;
      }

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