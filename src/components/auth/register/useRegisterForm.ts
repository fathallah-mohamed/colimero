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
      // 1. Vérifier si l'email existe déjà
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

      // 2. Créer le compte auth
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

      console.log("Réponse signUp:", { data: signUpData, error: signUpError });

      if (signUpError) {
        console.error("Erreur signup:", signUpError);
        throw signUpError;
      }

      if (!signUpData.user?.id) {
        console.error("Pas d'ID utilisateur reçu");
        throw new Error("Aucun ID utilisateur reçu");
      }

      // 3. Créer le profil client
      console.log("3. Création du profil client...");
      const { error: insertError } = await supabase
        .from('clients')
        .insert([
          {
            id: signUpData.user.id,
            email: email.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            email_verified: false,
          }
        ]);

      if (insertError) {
        console.error("Erreur insertion client:", insertError);
        throw insertError;
      }

      // 4. Envoyer l'email d'activation
      console.log("4. Envoi de l'email d'activation...");
      const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
        body: { email: email.trim() }
      });

      if (emailError) {
        console.error("Erreur envoi email:", emailError);
        throw emailError;
      }

      // 5. Déconnexion et succès
      console.log("5. Déconnexion et affichage du succès");
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