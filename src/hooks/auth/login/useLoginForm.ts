import { supabase } from "@/integrations/supabase/client";
import { clientAuthService } from "@/services/auth/client-auth-service";
import { LoginHookProps, UserType } from "@/types/auth";
import { useLoginState } from "./useLoginState";
import { authErrorHandler } from "@/services/auth/errors/auth-error-handler";

export function useLoginForm({ 
  onSuccess, 
  requiredUserType,
  onVerificationNeeded 
}: LoginHookProps = {}) {
  const { 
    state,
    resetState,
    setLoading,
    setError,
    setDialogState
  } = useLoginState();

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      resetState();

      console.log('Attempting login for:', email, 'type:', requiredUserType);

      // Gestion spécifique pour les clients
      if (requiredUserType === 'client') {
        const result = await clientAuthService.signIn(email, password);
        
        if (!result.success) {
          if (result.needsVerification) {
            if (onVerificationNeeded) {
              onVerificationNeeded();
            }
            setLoading(false);
            return;
          }
          throw new Error(result.error);
        }
      } else {
        // Authentification standard pour les autres types d'utilisateurs
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (signInError) {
          const errorResponse = authErrorHandler.handle(signInError);
          throw new Error(errorResponse.message);
        }

        if (!authData.user) {
          throw new Error("Aucune donnée utilisateur reçue");
        }

        // Vérification du type d'utilisateur
        const userType = authData.user.user_metadata?.user_type as UserType;
        console.log('User type:', userType);

        if (requiredUserType && userType !== requiredUserType) {
          console.log('Invalid user type:', userType, 'required:', requiredUserType);
          await supabase.auth.signOut();
          throw new Error(
            `Ce compte n'est pas un compte ${
              requiredUserType === 'client' ? 'client' : 
              requiredUserType === 'carrier' ? 'transporteur' : 
              'administrateur'
            }`
          );
        }
      }

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const setShowVerificationDialog = (show: boolean) => 
    setDialogState('showVerificationDialog', show);

  const setShowErrorDialog = (show: boolean) => 
    setDialogState('showErrorDialog', show);

  const setShowActivationDialog = (show: boolean) => 
    setDialogState('showActivationDialog', show);

  return {
    ...state,
    setShowVerificationDialog,
    setShowErrorDialog,
    setShowActivationDialog,
    handleLogin,
  };
}