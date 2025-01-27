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

      // Check if it's a client trying to log in
      if (!requiredUserType || requiredUserType === 'client') {
        const { data: clientData } = await supabase
          .from('clients')
          .select('email_verified, status, activation_code')
          .eq('email', email.trim())
          .maybeSingle();

        if (clientData) {
          // If client exists but isn't verified
          if (!clientData.email_verified || clientData.status !== 'active') {
            console.log('Account needs verification');
            setShowVerificationDialog(true);
            if (onVerificationNeeded) {
              onVerificationNeeded();
            }
            setError("Votre compte n'est pas activé. Veuillez vérifier votre email pour le code d'activation.");
            return;
          }
        }
      }

      // Attempt login
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        let errorMessage = "Email ou mot de passe incorrect";
        
        if (signInError.message.includes("Email not confirmed")) {
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          errorMessage = "Votre compte n'est pas activé. Veuillez vérifier votre email.";
        }

        setError(errorMessage);
        setShowErrorDialog(true);
        return;
      }

      if (!authData.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Verify user type if required
      const userType = authData.user.user_metadata?.user_type;
      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        throw new Error(`Ce compte n'est pas un compte ${
          requiredUserType === 'client' ? 'client' : 
          requiredUserType === 'carrier' ? 'transporteur' : 
          'administrateur'
        }`);
      }

      // Final verification for clients
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
          setError("Votre compte n'est pas activé. Veuillez vérifier votre email.");
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