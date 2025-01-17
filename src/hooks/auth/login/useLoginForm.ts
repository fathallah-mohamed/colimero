import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth-service";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
}

export function useLoginForm({ onSuccess, requiredUserType }: UseLoginFormProps = {}) {
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

    const response = await authService.signIn(email, password);

    if (response.needsVerification) {
      setShowVerificationDialog(true);
      setPassword("");
      setIsLoading(false);
      return;
    }

    if (!response.success) {
      setError(response.error || "Une erreur est survenue");
      setShowErrorDialog(true);
      setPassword("");
      setIsLoading(false);
      return;
    }

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

    setIsLoading(false);
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