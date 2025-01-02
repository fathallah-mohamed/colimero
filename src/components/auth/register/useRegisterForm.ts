import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useConsentValidation } from "./useConsentValidation";
import { registerClient } from "./useClientRegistration";
import { UseRegisterFormReturn } from "./types";

export function useRegisterForm(onLogin: () => void): UseRegisterFormReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [acceptedConsents, setAcceptedConsents] = useState<string[]>([]);
  const { toast } = useToast();

  const { requiredConsentsCount, allRequiredConsentsAccepted } = useConsentValidation(acceptedConsents);

  const areRequiredFieldsFilled = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword &&
      allRequiredConsentsAccepted
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areRequiredFieldsFilled()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = {
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
        birthDate,
        address,
        idDocument,
        acceptedConsents,
      };

      const { data, error } = await registerClient(formData);

      if (error) {
        if (error.message === "User already registered") {
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          });
          onLogin();
          return;
        }
        throw error;
      }

      toast({
        title: "Compte créé avec succès",
        description: "Vous pouvez maintenant vous connecter",
      });

      onLogin();
    } catch (error: any) {
      console.error("Erreur complète:", error);
      let errorMessage = "Une erreur est survenue lors de l'inscription";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.message === "Email not confirmed") {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter";
      }

      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentChange = (consentId: string, accepted: boolean) => {
    setAcceptedConsents(prev => 
      accepted 
        ? [...prev, consentId]
        : prev.filter(id => id !== consentId)
    );
  };

  return {
    isLoading,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    birthDate,
    setBirthDate,
    address,
    setAddress,
    idDocument,
    setIdDocument,
    acceptedConsents,
    handleConsentChange,
    handleSubmit,
    requiredConsentsCount,
    allRequiredConsentsAccepted,
    areRequiredFieldsFilled,
  };
}