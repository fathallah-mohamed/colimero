import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "./useAuthState";
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
  } = useAuthState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowVerificationDialog(false);
    setShowErrorDialog(false);

    try {
      // Vérifier le statut de vérification du client
      const clientData = await clientVerificationService.checkVerificationStatus(email);
      console.log("Client verification status:", clientData);

      // Tentative de connexion
      const { data: signInData, error: signInError } = await authService.signIn(email, password);

      if (signInError) {
        console.error("Sign in error:", signInError);
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (signInError.message === "Invalid login credentials") {
          errorMessage = "Email ou mot de passe incorrect";
        }

        setError(errorMessage);
        setShowErrorDialog(true);
        setPassword("");
        return;
      }

      if (!signInData.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const userType = signInData.user.user_metadata?.user_type;
      console.log("User type:", userType, "Required type:", requiredUserType);

      // Valider le type d'utilisateur
      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        await authService.signOut();
        return;
      }

      // Vérifier l'activation du compte client
      if (userType === 'client' && clientData && !clientData.email_verified) {
        console.log("Client account not verified");
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setShowVerificationDialog(true);
        setPassword("");
        await authService.signOut();
        return;
      }

      // Succès
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