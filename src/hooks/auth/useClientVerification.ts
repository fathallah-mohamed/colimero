import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClientStatus {
  isVerified: boolean;
  status: string;
  exists: boolean;
}

export function useClientVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkClientStatus = async (email: string): Promise<ClientStatus> => {
    try {
      console.log('Checking client status for:', email);
      const { data: clientData, error } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      if (error) {
        console.error("Error checking client status:", error);
        throw new Error("Une erreur est survenue lors de la vérification de votre compte");
      }

      console.log('Client data:', clientData);

      return {
        isVerified: clientData?.email_verified ?? false,
        status: clientData?.status ?? 'pending',
        exists: clientData !== null
      };
    } catch (error) {
      console.error("Error in checkClientStatus:", error);
      throw error;
    }
  };

  const activateAccount = async (activationCode: string, email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .rpc('activate_client_account', {
          p_activation_code: activationCode
        });

      if (error) {
        setError("Code d'activation invalide ou expiré");
        return false;
      }

      if (!data) {
        setError("Code d'activation invalide");
        return false;
      }

      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès"
      });

      return true;
    } catch (error) {
      console.error('Error in activateAccount:', error);
      setError("Une erreur est survenue lors de l'activation");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendActivationEmail = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (error) {
        setError("Impossible d'envoyer l'email d'activation");
        return false;
      }

      toast({
        title: "Email envoyé",
        description: "Un nouveau code d'activation a été envoyé à votre adresse email"
      });

      return true;
    } catch (error) {
      console.error('Error in resendActivationEmail:', error);
      setError("Une erreur est survenue lors de l'envoi");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    checkClientStatus,
    activateAccount,
    resendActivationEmail
  };
}