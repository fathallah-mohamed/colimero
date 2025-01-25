import { useNavigate } from "react-router-dom";
import { useAuthState } from "./useAuthState";
import { authService } from "@/services/auth/auth-service";
import { useEmailVerification } from "../useEmailVerification";

export interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  onVerificationNeeded?: () => void;
}

export function useLoginForm({ 
  onSuccess, 
  requiredUserType,
  onVerificationNeeded 
}: UseLoginFormProps = {}) {
  const navigate = useNavigate();
  const { verifyEmail, isVerifying, showConfirmationDialog, setShowConfirmationDialog } = useEmailVerification();
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    setIsLoading,
    error,
    setError,
    showVerificationDialog,
    setShowVerificationDialog,
    showErrorDialog,
    setShowErrorDialog,
    resetState
  } = useAuthState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetState();

    try {
      // Première vérification de l'email
      const isEmailVerified = await verifyEmail(email);
      if (!isEmailVerified) {
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setShowVerificationDialog(true);
        setPassword("");
        return;
      }

      // Tentative de connexion
      const loginResponse = await authService.signIn(email, password);
      if (!loginResponse.success || !loginResponse.user) {
        setError(loginResponse.error || "Erreur de connexion");
        setShowErrorDialog(true);
        setPassword("");
        return;
      }

      // Vérification du type d'utilisateur
      const userType = loginResponse.user.user_metadata?.user_type;
      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        await authService.signOut();
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        const returnPath = sessionStorage.getItem('returnPath');
        if (returnPath) {
          sessionStorage.removeItem('returnPath');
          navigate(returnPath);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Une erreur inattendue s'est produite");
      setShowErrorDialog(true);
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading: isLoading || isVerifying,
    error,
    showVerificationDialog,
    showErrorDialog,
    showConfirmationDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    setShowConfirmationDialog,
    handleSubmit,
  };
}