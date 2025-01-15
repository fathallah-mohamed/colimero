import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export function useRegisterForm(onSuccess: (type: 'new' | 'existing') => void) {
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

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    setIsLoading(true);

    try {
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
        console.error("SignUp error:", signUpError);
        
        if (signUpError.message.includes("User already registered")) {
          onSuccess('existing');
          return;
        }

        throw signUpError;
      }

      if (!signUpData?.user?.id) {
        throw new Error("Erreur lors de la création du compte");
      }

      await supabase.auth.signOut();

      const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
        body: { email: email.trim() }
      });

      if (emailError) {
        console.error("Erreur d'envoi d'email:", emailError);
        throw new Error("Erreur lors de l'envoi de l'email d'activation");
      }

      onSuccess('new');
    } catch (error: unknown) {
      console.error("Complete error:", error);
      let errorMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
      
      if (error instanceof AuthError) {
        switch (error.message) {
          case "User already registered":
            onSuccess('existing');
            return;
          case "Password should be at least 6 characters":
            errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
            break;
          case "Email not confirmed":
            errorMessage = "Veuillez confirmer votre email avant de vous connecter.";
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const areRequiredFieldsFilled = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+33|0)[1-9](\d{8}|\s\d{2}\s\d{2}\s\d{2}\s\d{2})$/;
    
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      emailRegex.test(email.trim()) &&
      phoneRegex.test(phone.trim()) &&
      password.trim().length >= 8 &&
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