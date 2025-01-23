import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth-service";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowVerificationDialog(false);
    setShowErrorDialog(false);

    try {
      const response = await authService.signIn(email, password);

      if (response.needsVerification) {
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
        if (response.error) {
          setError(response.error);
          setShowErrorDialog(true);
        }
        setPassword("");
        setIsLoading(false);
        return;
      }

      // Si la connexion est réussie
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
      console.error("Complete error:", error);
      const errorMessage = "Une erreur inattendue s'est produite";
      setError(errorMessage);
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