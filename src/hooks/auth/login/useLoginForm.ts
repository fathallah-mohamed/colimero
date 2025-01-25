import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClientLogin } from "./useClientLogin";
import { useCarrierLogin } from "./useCarrierLogin";
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
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const clientLogin = useClientLogin({ 
    onSuccess: handleSuccess,
    onVerificationNeeded: () => {
      setShowVerificationDialog(true);
      if (onVerificationNeeded) {
        onVerificationNeeded();
      }
    }
  });

  const carrierLogin = useCarrierLogin({ 
    onSuccess: handleSuccess 
  });

  function handleSuccess() {
    if (onSuccess) {
      onSuccess();
      return;
    }

    const returnPath = sessionStorage.getItem('returnPath');
    if (returnPath) {
      sessionStorage.removeItem('returnPath');
      navigate(returnPath);
    } else {
      navigate("/");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (requiredUserType === 'carrier') {
      await carrierLogin.handleLogin(email, password);
    } else {
      await clientLogin.handleLogin(email, password);
    }

    if (clientLogin.error || carrierLogin.error) {
      setShowErrorDialog(true);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading: clientLogin.isLoading || carrierLogin.isLoading,
    error: clientLogin.error || carrierLogin.error,
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleSubmit,
  };
}