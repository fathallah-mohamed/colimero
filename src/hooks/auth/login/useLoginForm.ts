import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { clientAuthService } from "@/services/auth/client-auth-service";
import { UseLoginFormProps, LoginFormState } from "@/types/auth/login";
import { UserType } from "@/types/auth";

export function useLoginForm({ 
  onSuccess, 
  requiredUserType,
  onVerificationNeeded 
}: UseLoginFormProps = {}) {
  const [state, setState] = useState<LoginFormState>({
    isLoading: false,
    error: null,
    showVerificationDialog: false,
    showErrorDialog: false,
    showActivationDialog: false,
  });

  const resetState = () => {
    setState(prev => ({
      ...prev,
      error: null,
      showVerificationDialog: false,
      showErrorDialog: false,
      showActivationDialog: false,
    }));
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      resetState();

      console.log('Attempting login for:', email, 'type:', requiredUserType);

      if (requiredUserType === 'client') {
        const result = await clientAuthService.signIn(email, password);
        
        if (!result.success) {
          if (result.needsVerification) {
            if (onVerificationNeeded) {
              onVerificationNeeded();
            }
            setState(prev => ({ ...prev, isLoading: false }));
            return;
          }
          throw new Error(result.error);
        }
      } else {
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

        const userType = authData.user.user_metadata?.user_type as UserType;
        console.log('User type:', userType);

        if (requiredUserType && userType !== requiredUserType) {
          console.log('Invalid user type:', userType, 'required:', requiredUserType);
          await supabase.auth.signOut();
          throw new Error(`Ce compte n'est pas un compte ${
            requiredUserType === 'client' ? 'client' : 
            requiredUserType === 'carrier' ? 'transporteur' : 
            'administrateur'
          }`);
        }
      }

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Login error:', error);
      setState(prev => ({
        ...prev,
        error: error.message || "Une erreur est survenue lors de la connexion",
        showErrorDialog: !state.showVerificationDialog && !state.showActivationDialog
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const setShowVerificationDialog = (show: boolean) => 
    setState(prev => ({ ...prev, showVerificationDialog: show }));

  const setShowErrorDialog = (show: boolean) => 
    setState(prev => ({ ...prev, showErrorDialog: show }));

  const setShowActivationDialog = (show: boolean) => 
    setState(prev => ({ ...prev, showActivationDialog: show }));

  return {
    ...state,
    setShowVerificationDialog,
    setShowErrorDialog,
    setShowActivationDialog,
    handleLogin,
  };
}