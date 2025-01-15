import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useConsentValidation } from "./useConsentValidation";
import { registerClient } from "./useClientRegistration";
import { UseRegisterFormReturn } from "./types";
import { supabase } from "@/integrations/supabase/client";

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

      if (!data?.user?.id) {
        throw new Error("Erreur lors de la création du compte");
      }

      // Send activation email
      const { data: client } = await supabase
        .from('clients')
        .select('activation_token')
        .eq('id', data.user.id)
        .single();

      if (client?.activation_token) {
        const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
          body: {
            email: email.trim(),
            first_name: firstName,
            activation_token: client.activation_token,
          },
        });

        if (emailError) {
          console.error('Error sending activation email:', emailError);
          toast({
            variant: "destructive",
            title: "Erreur d'envoi d'email",
            description: "L'email d'activation n'a pas pu être envoyé. Veuillez réessayer.",
          });
          return;
        }
      }

      toast({
        title: "Compte créé avec succès",
        description: "Un email d'activation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
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