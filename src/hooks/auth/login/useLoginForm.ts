import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  onVerificationNeeded?: () => void;
}

export function useLoginForm({ 
  onSuccess, 
  requiredUserType,
  onVerificationNeeded 
}: UseLoginFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      // 1. Vérifier d'abord si le client existe et n'est pas vérifié
      if (!requiredUserType || requiredUserType === 'client') {
        console.log('Checking client verification status...');
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email_verified, status')
          .eq('email', email.trim())
          .maybeSingle();

        if (clientError) {
          console.error('Error checking client status:', clientError);
          throw new Error("Erreur lors de la vérification du compte");
        }

        console.log('Client verification data:', clientData);

        if (clientData && (!clientData.email_verified || clientData.status !== 'active')) {
          console.log('Account needs verification');
          
          // Envoyer un nouvel email d'activation
          const { error: functionError } = await supabase.functions.invoke('send-activation-email', {
            body: { 
              email: email.trim(),
              resend: true
            }
          });

          if (functionError) {
            console.error('Error sending activation email:', functionError);
          } else {
            console.log('Activation email sent successfully');
          }

          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          
          setShowVerificationDialog(true);
          setError("Votre compte n'est pas activé. Veuillez vérifier votre email.");
          return;
        }
      }

      // 2. Tentative de connexion
      console.log('Attempting login...');
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw new Error(signInError.message === "Invalid login credentials" 
          ? "Email ou mot de passe incorrect"
          : "Une erreur est survenue lors de la connexion");
      }

      if (!data.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // 3. Vérification du type d'utilisateur
      const userType = data.user.user_metadata?.user_type;
      if (requiredUserType && userType !== requiredUserType) {
        console.log('Invalid user type:', userType, 'required:', requiredUserType);
        await supabase.auth.signOut();
        throw new Error(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
      }

      console.log('Login successful');
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