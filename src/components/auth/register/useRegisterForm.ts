import { useState } from "react";
import { registerClient } from "./useClientRegistration";
import { RegisterFormState } from "./types";
import { useToast } from "@/hooks/use-toast";

export function useRegisterForm(onSuccess: (type: 'new' | 'existing') => void) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phone_secondary, setPhoneSecondary] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSentDialog, setShowEmailSentDialog] = useState(false);
  const { toast } = useToast();

  const areRequiredFieldsFilled = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areRequiredFieldsFilled()) return;

    setIsLoading(true);
    try {
      const formData: RegisterFormState = {
        firstName,
        lastName,
        email,
        phone,
        phone_secondary,
        address,
        password,
        confirmPassword,
      };

      const { success, error, type } = await registerClient(formData);

      if (!success) {
        throw new Error(error || "Une erreur est survenue lors de l'inscription");
      }

      if (type === 'existing') {
        toast({
          title: "Compte existant",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
        });
        onSuccess('existing');
        return;
      }
      
      setShowEmailSentDialog(true);

    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSentDialogClose = () => {
    setShowEmailSentDialog(false);
    onSuccess('new');
  };

  return {
    firstName,
    lastName,
    email,
    phone,
    phone_secondary,
    address,
    password,
    confirmPassword,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setPhoneSecondary,
    setAddress,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    isLoading,
    showEmailSentDialog,
    handleEmailSentDialogClose,
    areRequiredFieldsFilled
  };
}