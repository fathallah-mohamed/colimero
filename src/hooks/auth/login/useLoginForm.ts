import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { clientAuthService } from "@/services/auth/client-auth-service";
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
  const [showActivationDialog, setShowActivationDialog] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);
      setShowActivationDialog(false);

      console.log('Attempting login for:', email, 'type:', requiredUserType);

      if (requiredUserType === 'client') {
        const result = await clientAuthService.signIn(email, password);
        
        if (!result.success) {
          if (result.needsVerification) {
            if (onVerificationNeeded) {
              onVerificationNeeded();
            }
            return;
          }
          throw new Error(result.error);
        }
      } else {
        // First attempt to sign in to get user metadata
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

        // Check user type from metadata and ensure it's a valid UserType
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
      }

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || "Une erreur est survenue lors de la connexion");
      if (!showVerificationDialog && !showActivationDialog) {
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
    showActivationDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    setShowActivationDialog,
    handleLogin,
  };
}