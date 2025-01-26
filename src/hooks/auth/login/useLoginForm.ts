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
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      // 1. Vérifier d'abord si le client existe et n'est pas vérifié
      if (!requiredUserType || requiredUserType === 'client') {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email_verified, status')
          .eq('email', email.trim())
          .maybeSingle();

        if (clientError && !clientError.message.includes('contain')) {
          console.error('Error checking client status:', clientError);
          throw new Error("Erreur lors de la vérification du compte");
        }

        // Si le compte existe et n'est pas vérifié
        if (clientData && (!clientData.email_verified || clientData.status !== 'active')) {
          console.log('Account needs verification, sending activation email');
          
          const { error: functionError } = await supabase.functions.invoke('send-activation-email', {
            body: { 
              email: email.trim(),
              resend: true
            }
          });

          if (functionError) {
            console.error('Error sending activation email:', functionError);
          }

          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          
          setShowVerificationDialog(true);
          return;
        }
      }

      // 2. Tentative de connexion
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

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message);
      if (!showVerificationDialog) {
        setShowErrorDialog(true);
      }
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