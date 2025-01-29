import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAccountActivation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const activateAccount = async (activationCode: string, email: string) => {
    setIsLoading(true);
    setError(null);
    console.log("Attempting to activate account with code:", activationCode, "for email:", email);

    try {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .eq('activation_code', activationCode)
        .single();

      if (clientError || !clientData) {
        console.error("Error finding client:", clientError);
        setError("Code d'activation invalide");
        return false;
      }

      const { data, error: activationError } = await supabase.rpc(
        'activate_client_account',
        { p_activation_code: activationCode }
      );

      if (activationError) {
        console.error("Error activating account:", activationError);
        setError("Une erreur est survenue lors de l'activation");
        return false;
      }

      console.log("Account activated successfully");
      return true;

    } catch (error) {
      console.error("Unexpected error during activation:", error);
      setError("Une erreur inattendue est survenue");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendActivationEmail = async (email: string) => {
    setIsLoading(true);
    setError(null);
    console.log("Sending activation email to:", email);

    try {
      const { error: emailError } = await supabase.functions.invoke(
        'send-activation-email',
        {
          body: { email }
        }
      );

      if (emailError) {
        console.error("Error sending activation email:", emailError);
        setError("Impossible d'envoyer l'email d'activation");
        return false;
      }

      console.log("Activation email sent successfully");
      return true;

    } catch (error) {
      console.error("Error in sendActivationEmail:", error);
      setError("Une erreur est survenue lors de l'envoi de l'email");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    activateAccount,
    sendActivationEmail
  };
}