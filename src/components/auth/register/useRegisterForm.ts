import { useState } from "react";
import { registerClient } from "./useClientRegistration";
import { RegisterFormState } from "./types";

export function useRegisterForm(onSuccess: (type: 'new' | 'existing') => void) {
  const [formState, setFormState] = useState<RegisterFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phone_secondary: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleFieldChange = (field: keyof RegisterFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerClient(formState);
      setShowSuccessDialog(true);
      onSuccess('new');
    } catch (error: any) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  return {
    formState,
    isLoading,
    showSuccessDialog,
    handleFieldChange,
    handleSubmit,
    handleCloseSuccessDialog,
  };
}