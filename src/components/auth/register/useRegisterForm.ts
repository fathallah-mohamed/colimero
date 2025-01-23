import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useRegisterForm(onSuccess: (type: 'new' | 'existing') => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const validateInputs = () => {
    if (firstName.trim().length < 2) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Le prénom doit contenir au moins 2 caractères",
      });
      return false;
    }

    if (lastName.trim().length < 2) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Le nom doit contenir au moins 2 caractères",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "L'adresse email n'est pas valide",
      });
      return false;
    }

    const phoneRegex = /^(\+33|0)[1-9](\d{8}|\s\d{2}\s\d{2}\s\d{2}\s\d{2})$/;
    if (!phoneRegex.test(phone.trim())) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Le numéro de téléphone n'est pas valide",
      });
      return false;
    }

    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Le mot de passe doit contenir au moins 8 caractères",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Les mots de passe ne correspondent pas",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("1. Vérification de l'email:", email);
      const { data: existingClient, error: checkError } = await supabase
        .from('clients')
        .select('id, email_verified')
        .eq('email', email.trim())
        .maybeSingle();

      if (checkError) {
        console.error("Erreur lors de la vérification de l'email:", checkError);
        throw checkError;
      }

      if (existingClient) {
        console.log("Email existant trouvé:", existingClient);
        setIsLoading(false);
        onSuccess('existing');
        return;
      }

      console.log("2. Création du compte auth...");
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            user_type: 'client',
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          setIsLoading(false);
          onSuccess('existing');
          return;
        }
        console.error("Erreur signup:", signUpError);
        throw signUpError;
      }

      if (!signUpData.user?.id) {
        throw new Error("Aucun ID utilisateur reçu");
      }

      console.log("3. Envoi de l'email d'activation...");
      const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
        body: { email: email.trim() }
      });

      if (emailError) {
        console.error("Erreur envoi email:", emailError);
        throw emailError;
      }

      // Ajout du toast de confirmation d'envoi du mail d'activation
      toast({
        title: "Email d'activation envoyé",
        description: "Un email d'activation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.",
      });

      await supabase.auth.signOut();
      onSuccess('new');
      
    } catch (error: any) {
      console.error("Erreur complète:", error);
      
      let errorMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
      
      if (error.message.includes("User already registered")) {
        onSuccess('existing');
        return;
      }

      if (error.message.includes("duplicate key")) {
        errorMessage = "Cette adresse email est déjà utilisée.";
      } else if (error.message.includes("Password should be")) {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
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