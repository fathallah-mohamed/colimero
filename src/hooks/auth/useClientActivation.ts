import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useClientActivation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const activateAccount = async (activationCode: string, email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .single();

      if (clientError) {
        throw new Error('Client non trouvé');
      }

      const { data, error } = await supabase.rpc('verify_client_account', {
        p_user_id: clientData.id,
        p_activation_code: activationCode
      });

      if (error) throw error;

      if (!data) {
        throw new Error("Code d'activation invalide ou expiré");
      }

      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter."
      });

      navigate('/connexion', { replace: true });
      return true;
    } catch (error: any) {
      console.error('Error in activateAccount:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur d'activation",
        description: error.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendActivationCode = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: "Code envoyé",
        description: "Un nouveau code d'activation vous a été envoyé par email."
      });
      return true;
    } catch (error: any) {
      console.error('Error in resendActivationCode:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le code d'activation"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    activateAccount,
    resendActivationCode
  };
}