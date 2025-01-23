import { useState } from "react";
import { registerClient } from "./useClientRegistration";
import { RegisterFormState } from "./types";
import { useToast } from "@/hooks/use-toast";

export function useRegisterForm(onSuccess: (type: 'new' | 'existing') => void) {
  const [formState, setFormState] = useState<RegisterFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phone_secondary: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSentDialog, setShowEmailSentDialog] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await registerClient(formState);

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de l'inscription"
        });
        return;
      }

      if (result.type === 'existing') {
        toast({
          title: "Compte existant",
          description: "Un compte existe déjà avec cet email"
        });
        onSuccess('existing');
        return;
      }
      
      setShowEmailSentDialog(true);
      onSuccess('new');

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const areRequiredFieldsFilled = () => {
    return (
      formState.firstName.trim() !== '' &&
      formState.lastName.trim() !== '' &&
      formState.email.trim() !== '' &&
      formState.phone.trim() !== '' &&
      formState.address.trim() !== '' &&
      formState.password.trim() !== '' &&
      formState.confirmPassword.trim() !== '' &&
      formState.password === formState.confirmPassword
    );
  };

  return {
    formState,
    setFormState,
    isLoading,
    showEmailSentDialog,
    setShowEmailSentDialog,
    handleSubmit,
    areRequiredFieldsFilled,
  };
}