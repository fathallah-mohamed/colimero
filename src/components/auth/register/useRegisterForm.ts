import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useRegisterForm(onLogin: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez accepter les conditions pour continuer",
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
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            user_type: 'client'
          },
        },
      });

      if (signUpError) {
        if (signUpError.message === "User already registered") {
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

      if (signUpData.user) {
        const { error: clientError } = await supabase
          .from('clients')
          .update({
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
          })
          .eq('id', signUpData.user.id);

        if (clientError) throw clientError;
      }

      toast({
        title: "Compte créé avec succès",
        description: "Vous pouvez maintenant vous connecter",
      });

      onLogin();
    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
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
    termsAccepted,
    setTermsAccepted,
    handleSubmit,
  };
}