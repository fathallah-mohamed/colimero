import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { registerClient } from "./useClientRegistration";
import { RegisterFormState } from "./types";
import { useConsentValidation } from "./useConsentValidation";

export function useRegisterForm(onLogin: () => void) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");
    
    if (!areRequiredFieldsFilled()) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData: RegisterFormState = {
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

      console.log("Calling registerClient with data:", { ...formData, password: "[REDACTED]" });
      const { data, error } = await registerClient(formData);

      if (error) {
        let errorMessage = "Une erreur est survenue lors de l'inscription";
        
        if (error.message.includes("User already registered")) {
          errorMessage = "Un compte existe déjà avec cet email. Veuillez vous connecter.";
          onLogin();
          return;
        }

        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: errorMessage,
        });
        return;
      }

      if (!data?.user?.id) {
        throw new Error("Erreur lors de la création du compte");
      }

      toast({
        title: "Compte créé avec succès",
        description: "Un email d'activation vous a été envoyé. Veuillez vérifier votre boîte de réception pour activer votre compte.",
      });

      onLogin();
    } catch (error: any) {
      console.error("Complete error:", error);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
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