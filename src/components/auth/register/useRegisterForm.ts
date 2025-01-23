import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerClient } from "./useClientRegistration";
import { RegisterFormState } from "./types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areRequiredFieldsFilled()) return;

    try {
      setIsLoading(true);
      console.log("Starting registration process...");

      const { data, error } = await registerClient({
        firstName,
        lastName,
        email,
        phone,
        phone_secondary,
        address,
        password,
        confirmPassword
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: "Compte existant",
            description: "Un compte existe déjà avec cette adresse email. Veuillez vous connecter."
          });
          onSuccess('existing');
          return;
        }

        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de l'inscription"
        });
        return;
      }

      // Connexion automatique après l'inscription
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Error signing in after registration:', signInError);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Inscription réussie mais erreur lors de la connexion automatique. Veuillez vous connecter manuellement."
        });
        onSuccess('new');
        return;
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé et vous êtes maintenant connecté"
      });
      navigate('/');

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur inattendue s'est produite"
      });
    } finally {
      setIsLoading(false);
    }
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
    setShowEmailSentDialog,
    areRequiredFieldsFilled
  };
}