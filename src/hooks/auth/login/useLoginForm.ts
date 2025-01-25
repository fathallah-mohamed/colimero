import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "../useAuthState";
import { authService } from "@/services/auth/auth-service";
import { clientVerificationService } from "@/services/auth/client-verification";

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
    resetState
  } = useAuthState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetState();

    try {
      // Vérifier d'abord si c'est un client et si le compte est vérifié
      const clientData = await clientVerificationService.checkVerificationStatus(email);
      console.log("Client verification status:", clientData);

      // Si c'est un client et que le compte n'est pas vérifié, bloquer la connexion
      if (clientData && !clientData.email_verified) {
        console.log("Client account not verified");
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setShowVerificationDialog(true);
        setPassword("");
        setIsLoading(false);
        return;
      }

      // Si le compte est vérifié ou si ce n'est pas un client, procéder à la connexion
      const loginResponse = await authService.signIn(email, password);

      if (!loginResponse.success || !loginResponse.user) {
        setError(loginResponse.error || "Erreur de connexion");
        setShowErrorDialog(true);
        setPassword("");
        return;
      }

      // Valider le type d'utilisateur si requis
      const validationResponse = authService.validateUserType(loginResponse.user, requiredUserType);
      if (!validationResponse.success) {
        setError(validationResponse.error);
        setShowErrorDialog(true);
        await authService.signOut();
        return;
      }

      // Double vérification après la connexion pour les clients
      const userType = loginResponse.user.user_metadata?.user_type;
      if (userType === 'client') {
        const verificationStatus = await clientVerificationService.checkVerificationStatus(email);
        if (!verificationStatus?.email_verified) {
          console.log("Client account verification check failed after login");
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setShowVerificationDialog(true);
          setPassword("");
          await authService.signOut();
          return;
        }
      }

      // Succès de la connexion
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
      console.error("Complete login error:", error);
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