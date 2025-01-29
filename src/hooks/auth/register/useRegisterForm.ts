import { useState } from "react";
import { RegisterFormState } from "@/types/auth";
import { registerClient } from "./useClientRegistration";
import { useToast } from "@/hooks/use-toast";

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
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    if (!formState.email || !formState.password) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "L'email et le mot de passe sont requis"
      });
      return false;
    }

    if (formState.password !== formState.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas"
      });
      return false;
    }

    if (formState.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères"
      });
      return false;
    }

    return true;
  };

  const handleFieldChange = (field: keyof RegisterFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting registration process with data:", {
      ...formState,
      password: "[HIDDEN]",
      confirmPassword: "[HIDDEN]"
    });
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerClient(formState);
      console.log("Registration result:", result);

      if (result.success) {
        setShowVerificationDialog(true);
        onSuccess('new');
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de l'inscription"
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseVerificationDialog = () => {
    setShowVerificationDialog(false);
  };

  return {
    formState,
    isLoading,
    showVerificationDialog,
    handleFieldChange,
    handleSubmit,
    handleCloseVerificationDialog,
  };
}