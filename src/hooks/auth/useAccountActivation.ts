import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAccountActivation() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendActivationEmail = async (email: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { 
          email: email.trim(),
          resend: true
        }
      });

      if (error) {
        console.error("Error sending activation email:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'envoyer l'email d'activation. Veuillez réessayer."
        });
        return false;
      }

      toast({
        title: "Email envoyé",
        description: "Un nouvel email d'activation vous a été envoyé. Veuillez vérifier votre boîte de réception."
      });
      return true;
    } catch (error) {
      console.error("Error in sendActivationEmail:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email d'activation"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const activateAccount = async (activationCode: string, email: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .rpc('activate_client_account', {
          p_activation_code: activationCode
        });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur d'activation",
          description: "Code d'activation invalide ou expiré"
        });
        return false;
      }

      if (!data) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Code d'activation invalide"
        });
        return false;
      }

      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter."
      });

      return true;
    } catch (error) {
      console.error('Error in activateAccount:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendActivationEmail,
    activateAccount
  };
}