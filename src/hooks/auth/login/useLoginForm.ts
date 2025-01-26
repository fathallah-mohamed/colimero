import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserType } from "@/types/auth";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: UserType;
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

      console.log('Attempting login for:', email, 'type:', requiredUserType);

      // Check client verification status if required type is client
      if (requiredUserType === 'client') {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email_verified, status')
          .eq('email', email.trim())
          .maybeSingle();

        if (clientError) {
          console.error('Error checking client status:', clientError);
          throw new Error("Erreur lors de la vérification du compte");
        }

        if (clientData && (!clientData.email_verified || clientData.status !== 'active')) {
          console.log('Client account needs verification');
          
          const { error: functionError } = await supabase.functions.invoke('send-activation-email', {
            body: { 
              email: email.trim(),
              resend: true
            }
          });

          if (functionError) {
            console.error('Error sending activation email:', functionError);
            throw new Error("Erreur lors de l'envoi de l'email d'activation");
          }

          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          
          setShowVerificationDialog(true);
          return;
        }
      }

      // Attempt to sign in
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw new Error(signInError.message === "Invalid login credentials" 
          ? "Email ou mot de passe incorrect"
          : "Erreur lors de la connexion");
      }

      if (!authData.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Check user type from metadata
      const userType = authData.user.user_metadata?.user_type as UserType;
      console.log('User type:', userType);

      // Verify required user type if specified
      if (requiredUserType && userType !== requiredUserType) {
        console.log('Invalid user type:', userType, 'required:', requiredUserType);
        await supabase.auth.signOut();
        throw new Error(`Ce compte n'est pas un compte ${
          requiredUserType === 'client' ? 'client' : 
          requiredUserType === 'carrier' ? 'transporteur' : 
          'administrateur'
        }`);
      }

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || "Une erreur est survenue lors de la connexion");
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