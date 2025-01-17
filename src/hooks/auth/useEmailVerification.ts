import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useEmailVerification() {
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const resendActivationEmail = async (email: string) => {
    try {
      setIsResending(true);
      console.log("Tentative de renvoi de l'email d'activation à:", email);

      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (error) {
        console.error("Erreur lors de l'invocation de la fonction:", error);
        throw error;
      }

      toast({
        title: "Email envoyé",
        description: "Un nouvel email d'activation vous a été envoyé.",
      });
      return true;
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer l'email d'activation. Veuillez réessayer.",
      });
      return false;
    } finally {
      setIsResending(false);
    }
  };

  return {
    isResending,
    resendActivationEmail
  };
}