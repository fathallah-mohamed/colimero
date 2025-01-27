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

      // Only check client verification for client logins
      if (requiredUserType === 'client') {
        console.log('Checking client status...');
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email_verified, status')
          .eq('email', email.trim())
          .maybeSingle();

        if (clientError) {
          console.error('Error checking client status:', clientError);
          throw new Error("Erreur lors de la vérification du compte");
        }

        // Si le client existe et n'est pas vérifié, bloquer la connexion
        if (clientData && (!clientData.email_verified || clientData.status !== 'active')) {
          console.log('Account needs verification, showing dialog');
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setError("Votre compte n'est pas activé. Veuillez vérifier votre email pour activer votre compte.");
          return;
        }
      }

      // Attempt login
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

      // Verify user type if required
      const userType = authData.user.user_metadata?.user_type as UserType;
      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        throw new Error(`Ce compte n'est pas un compte ${
          requiredUserType === 'client' ? 'client' : 
          requiredUserType === 'carrier' ? 'transporteur' : 
          'administrateur'
        }`);
      }

      // Pour les clients, vérifier une dernière fois le statut
      if (userType === 'client') {
        const { data: clientData } = await supabase
          .from('clients')
          .select('email_verified, status')
          .eq('id', authData.user.id)
          .single();

        if (!clientData?.email_verified || clientData.status !== 'active') {
          await supabase.auth.signOut();
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setError("Votre compte n'est pas activé. Veuillez vérifier votre email pour activer votre compte.");
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