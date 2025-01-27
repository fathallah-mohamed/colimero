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
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      // 1. Vérifier d'abord le statut du client
      console.log('Checking client status...');
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status, activation_code, activation_expires_at')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientError) {
        console.error('Error checking client status:', clientError);
        throw new Error("Erreur lors de la vérification du compte");
      }

      console.log('Client data:', clientData);

      // Vérifier si le compte existe et n'est pas activé
      if (clientData && (!clientData.email_verified || clientData.status === 'pending')) {
        console.log('Account not verified or pending, showing verification dialog');
        
        // Vérifier si le code d'activation est expiré
        const isExpired = !clientData.activation_expires_at || 
                         new Date(clientData.activation_expires_at) < new Date();
        
        // Envoyer un nouvel email d'activation si nécessaire
        if (!clientData.activation_code || isExpired) {
          console.log('Sending new activation code...');
          const { error: functionError } = await supabase.functions.invoke(
            'send-activation-email',
            {
              body: { email: email.trim() }
            }
          );

          if (functionError) {
            console.error('Error sending activation email:', functionError);
            setError("Impossible d'envoyer l'email d'activation");
            setShowErrorDialog(true);
            setIsLoading(false);
            return;
          }
          console.log('Activation email sent successfully');
        }

        setShowVerificationDialog(true);
        if (onVerificationNeeded) {
          console.log('Calling onVerificationNeeded callback');
          onVerificationNeeded();
        }
        setIsLoading(false);
        return;
      }

      // 2. Si le compte est vérifié, tenter la connexion
      console.log('Attempting sign in...');
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        setError("Email ou mot de passe incorrect");
        setShowErrorDialog(true);
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // 3. Vérifier le type d'utilisateur si requis
      const userType = authData.user.user_metadata?.user_type as UserType;
      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        throw new Error(`Ce compte n'est pas un compte ${
          requiredUserType === 'client' ? 'client' : 
          requiredUserType === 'carrier' ? 'transporteur' : 
          'administrateur'
        }`);
      }

      console.log('Login successful');
      if (onSuccess) {
        console.log('Calling onSuccess callback');
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