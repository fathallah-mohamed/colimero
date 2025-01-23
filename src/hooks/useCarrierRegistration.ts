import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCarrierRegistration(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegistration = async (values: any) => {
    try {
      setIsLoading(true);
      console.log("Starting registration process...");

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            user_type: 'carrier',
            first_name: values.first_name,
            last_name: values.last_name,
            company_name: values.company_name
          }
        }
      });

      if (error) throw error;

      // Déconnexion immédiate après l'inscription
      await supabase.auth.signOut();

      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour activer votre compte.",
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRegistration
  };
}