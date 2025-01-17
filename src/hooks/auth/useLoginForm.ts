import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      if (response.error) {
        setError(response.error);
        setShowErrorDialog(true);
      }
      setPassword("");
      setIsLoading(false);
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