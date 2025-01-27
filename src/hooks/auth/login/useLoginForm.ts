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
  onVerificationNeeded,
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

      // Vérifier d'abord le statut du client
      if (requiredUserType === 'client' || !requiredUserType) {
        console.log('Checking client verification status...');
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email_verified, status, activation_code, activation_expires_at')
          .eq('email', email.trim())
          .maybeSingle();

        if (clientError) {
          console.error('Error checking client status:', clientError);
          throw new Error("Erreur lors de la vérification du compte");
        }

        // Si le client existe et n'est pas vérifié ou actif
        if (clientData && (!clientData.email_verified || clientData.status !== 'active')) {
          console.log('Account needs verification, checking activation code...');
          
          // Vérifier si le code d'activation est expiré ou n'existe pas
          const isExpired = !clientData.activation_expires_at || 
                           new Date(clientData.activation_expires_at) < new Date();

          if (!clientData.activation_code || isExpired) {
            console.log('Generating new activation code...');
            const { error: functionError } = await supabase.functions.invoke(
              'send-activation-email',
              {
                body: { 
                  email: email.trim(),
                  resend: true
                }
              }
            );

            if (functionError) {
              console.error('Error sending activation email:', functionError);
              throw new Error("Erreur lors de l'envoi de l'email d'activation");
            }
          }

          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setError("Votre compte n'est pas activé. Veuillez saisir le code d'activation reçu par email.");
          return;
        }
      }

      // Tentative de connexion
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

      // Vérifier le type d'utilisateur
      const userType = authData.user.user_metadata?.user_type as UserType;
      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        throw new Error(`Ce compte n'est pas un compte ${
          requiredUserType === 'client' ? 'client' : 
          requiredUserType === 'carrier' ? 'transporteur' : 
          'administrateur'
        }`);
      }

      // Vérification finale pour les clients
      if (userType === 'client' || !userType) {
        const { data: finalCheck } = await supabase
          .from('clients')
          .select('email_verified, status')
          .eq('id', authData.user.id)
          .single();

        if (!finalCheck?.email_verified || finalCheck.status !== 'active') {
          console.log('Final check failed - logging out user');
          await supabase.auth.signOut();
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setError("Votre compte n'est pas activé. Veuillez saisir le code d'activation reçu par email.");
          return;
        }
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