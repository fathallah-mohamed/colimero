import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: UserType;
  onVerificationNeeded?: () => void;
}

export function useLoginForm({ 
  onSuccess,
  requiredUserType,
  onVerificationNeeded,
}: UseLoginFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      console.log('Checking client status for:', email);

      // 1. Vérifier d'abord le statut du client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status, activation_code')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientError) {
        console.error('Error checking client status:', clientError);
        throw new Error("Erreur lors de la vérification du compte");
      }

      // 2. Si le client n'existe pas
      if (!clientData) {
        setError("Email ou mot de passe incorrect");
        setShowErrorDialog(true);
        return;
      }

      // 3. Si le client existe mais n'est pas vérifié ou est en attente
      if (!clientData.email_verified || clientData.status === 'pending') {
        console.log('Client not verified or pending:', clientData);
        
        // Envoyer un nouvel email d'activation si pas de code existant
        if (!clientData.activation_code) {
          console.log('No activation code found, sending new one...');
          const { error: activationError } = await supabase.functions.invoke(
            'send-activation-email',
            {
              body: { email }
            }
          );

          if (activationError) {
            console.error('Error sending activation email:', activationError);
            throw new Error("Erreur lors de l'envoi de l'email d'activation");
          }
        }

        setError("Votre compte n'est pas activé. Veuillez vérifier votre email.");
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setShowVerificationDialog(true);
        return;
      }

      // 4. Tentative de connexion
      console.log('Attempting sign in...');
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        setError("Email ou mot de passe incorrect");
        setShowErrorDialog(true);
        return;
      }

      if (!authData.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // 5. Vérifier le type d'utilisateur si requis
      const userType = authData.user.user_metadata?.user_type as UserType;
      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        throw new Error(`Ce compte n'est pas un compte ${
          requiredUserType === 'client' ? 'client' : 
          requiredUserType === 'carrier' ? 'transporteur' : 
          'administrateur'
        }`);
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message);
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleLogin,
  };
}