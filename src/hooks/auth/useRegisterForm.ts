import { useState } from "react";
import { RegisterFormState } from "@/types/auth";
import { clientAuthService } from "@/services/auth/client-auth-service";
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();

  const handleFieldChange = (field: keyof RegisterFormState, value: string) => {
    console.log(`Field ${String(field)} changed to:`, value);
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting registration process with data:", formState);
    setIsLoading(true);

    try {
      if (formState.password !== formState.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Les mots de passe ne correspondent pas",
        });
        return;
      }

      const result = await clientAuthService.signIn(formState.email, formState.password);
      console.log("Registration result:", result);

      if (result.success) {
        setShowSuccessDialog(true);
        toast({
          title: "Compte créé avec succès",
          description: "Veuillez vérifier votre email pour activer votre compte",
        });
        onSuccess('new');
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de l'inscription",
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
      });
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