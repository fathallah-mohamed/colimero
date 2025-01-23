import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth/auth-service";
import { clientVerificationService } from "@/services/auth/client-verification";
import { useAuthState } from "./useAuthState";

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
  const navigate = useNavigate();
  const { toast } = useToast();
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
  } = useAuthState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowVerificationDialog(false);
    setShowErrorDialog(false);

    try {
      // Check client verification status
      const clientData = await clientVerificationService.checkVerificationStatus(email);

      // Attempt login
      const loginResponse = await authService.signIn(email, password);
      
      if (!loginResponse.success) {
        setError(loginResponse.error);
        setShowErrorDialog(true);
        setPassword("");
        return;
      }

      // Validate user type if required
      const validationResponse = await authService.validateUserType(
        loginResponse.user,
        requiredUserType
      );

      if (!validationResponse.success) {
        setError(validationResponse.error);
        setShowErrorDialog(true);
        return;
      }

      // Check client verification status
      const userType = loginResponse.user.user_metadata?.user_type;
      if (userType === 'client' && clientData && !clientData.email_verified) {
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setShowVerificationDialog(true);
        await supabase.auth.signOut();
        return;
      }

      // Success
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });

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