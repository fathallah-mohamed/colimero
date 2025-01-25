import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "./useAuthState";
import { authService } from "@/services/auth/auth-service";
import { clientVerificationService } from "@/services/auth/client-verification";
import { useAuthRedirect } from "./useAuthRedirect";

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
  const { toast } = useToast();
  const { handleSuccessfulAuth } = useAuthRedirect();
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
      const clientData = await clientVerificationService.checkVerificationStatus(email);
      console.log("Client verification status:", clientData);

      const loginResponse = await authService.signIn(email, password);

      if (!loginResponse.success || !loginResponse.user) {
        setError(loginResponse.error || "Erreur de connexion");
        setShowErrorDialog(true);
        setPassword("");
        return;
      }

      if (clientData && !clientData.email_verified) {
        console.log("Client account not verified");
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setShowVerificationDialog(true);
        setPassword("");
        await authService.signOut();
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });

      if (onSuccess) {
        onSuccess();
      } else {
        handleSuccessfulAuth(loginResponse.user);
      }
    } catch (error: any) {
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
    isLoading,
    error,
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleSubmit,
  };
}