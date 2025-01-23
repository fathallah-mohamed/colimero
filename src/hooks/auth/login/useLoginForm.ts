import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth-service";
import { useToast } from "@/hooks/use-toast";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowVerificationDialog(false);
    setShowErrorDialog(false);

    try {
      console.log("Attempting login with:", { email: email.trim() });
      const response = await authService.signIn(email, password);
      console.log("Login response:", response);

      if (response.needsVerification) {
        console.log("Email verification needed");
        if (onVerificationNeeded) {
          onVerificationNeeded();
        } else {
          setShowVerificationDialog(true);
        }
        setPassword("");
        setIsLoading(false);
        return;
      }

      if (!response.success) {
        console.log("Login failed:", response.error);
        if (response.error) {
          setError(response.error);
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: response.error,
          });
          setShowErrorDialog(true);
        }
        setPassword("");
        setIsLoading(false);
        return;
      }

      console.log("Login successful");
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
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
      const errorMessage = error instanceof Error 
        ? "Email ou mot de passe incorrect"
        : "Une erreur inattendue s'est produite";
      
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: errorMessage,
      });
      setShowErrorDialog(true);
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    error,
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleSubmit,
  };
}