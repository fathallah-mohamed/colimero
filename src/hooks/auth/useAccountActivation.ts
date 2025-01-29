import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAccountActivation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendActivationEmail = async (email: string) => {
    try {
      console.log("Sending activation email to:", email);
      setIsLoading(true);
      setError(null);
      
      const { error: functionError } = await supabase.functions.invoke('send-activation-email', {
        body: { 
          email: email.trim(),
          resend: true
        }
      });

      if (functionError) {
        console.error("Error sending activation email:", functionError);
        setError("Impossible d'envoyer l'email d'activation");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'envoyer l'email d'activation. Veuillez réessayer."
        });
        return false;
      }

      console.log("Activation email sent successfully");
      toast({
        title: "Email envoyé",
        description: "Un nouvel email d'activation vous a été envoyé. Veuillez vérifier votre boîte de réception."
      });
      return true;
    } catch (error) {
      console.error("Error in sendActivationEmail:", error);
      setError("Une erreur est survenue lors de l'envoi de l'email d'activation");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const activateAccount = async (activationCode: string, email: string) => {
    try {
      console.log("Activating account with code:", activationCode, "for email:", email);
      setIsLoading(true);
      setError(null);
      
      // Vérifier d'abord si le client existe et n'est pas déjà vérifié
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientError) {
        console.error("Error checking client status:", clientError);
        setError("Une erreur est survenue lors de la vérification du compte");
        return false;
      }

      if (!clientData) {
        console.error("No client found for email:", email);
        setError("Compte non trouvé");
        return false;
      }

      if (clientData.email_verified) {
        console.log("Account already verified");
        setError("Ce compte est déjà activé");
        return false;
      }

      // Activer le compte
      const { data, error } = await supabase
        .rpc('activate_client_account', {
          p_activation_code: activationCode.trim()
        });

      if (error) {
        console.error("Error in activate_client_account:", error);
        setError("Code d'activation invalide ou expiré");
        toast({
          variant: "destructive",
          title: "Erreur d'activation",
          description: "Code d'activation invalide ou expiré"
        });
        return false;
      }

      if (!data) {
        console.error("Activation failed, no data returned");
        setError("Code d'activation invalide");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Code d'activation invalide"
        });
        return false;
      }

      console.log("Account activated successfully");
      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter."
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

  return {
    isLoading,
    error,
    sendActivationEmail,
    activateAccount
  };
}