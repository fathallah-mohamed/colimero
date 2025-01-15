import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useRegisterForm(onLogin: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      // Créer le compte sans connexion automatique
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            user_type: 'client',
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
          },
          emailRedirectTo: `${window.location.origin}/activation`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          });
          onLogin();
          return;
        }
        throw signUpError;
      }

      if (!signUpData?.user?.id) {
        throw new Error("Erreur lors de la création du compte");
      }

      // Envoyer l'email d'activation via notre fonction Edge
      const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
        body: { email: email.trim() }
      });

      if (emailError) {
        console.error("Erreur d'envoi d'email:", emailError);
        throw new Error("Erreur lors de l'envoi de l'email d'activation");
      }

      toast({
        title: "Compte créé avec succès",
        description: "Un email d'activation a été envoyé à votre adresse email. Veuillez cliquer sur le lien dans l'email pour activer votre compte.",
      });

      // Rediriger vers la page de connexion
      onLogin();
    } catch (error: any) {
      console.error("Complete error:", error);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: error.message || "Une erreur inattendue s'est produite. Veuillez réessayer.",
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
    handleSubmit,
    areRequiredFieldsFilled,
  };
}