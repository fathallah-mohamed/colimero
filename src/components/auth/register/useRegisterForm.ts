import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RegisterFormState, RegisterFormData } from "./types";

export function useRegisterForm(onSuccess: (type: 'new' | 'existing') => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSentDialog, setShowEmailSentDialog] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    try {
      setIsLoading(true);

      // Vérification email existant
      const { data: existingUser, error: existingUserError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUserError && existingUserError.code !== 'PGRST116') {
        throw existingUserError;
      }

      if (existingUser) {
        onSuccess('existing');
        return;
      }

      // Créer le compte utilisateur
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: 'client',
          },
        },
      });

      if (signUpError) throw signUpError;

      // Insertion dans la table clients
      const { error: insertError } = await supabase
        .from('clients')
        .insert({
          id: authData.user?.id,
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          email_verified: false,
        });

      if (insertError) throw insertError;

      setShowEmailSentDialog(true);
      onSuccess('new');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSentDialogClose = () => {
    setShowEmailSentDialog(false);
  };

  return {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    isLoading,
    showEmailSentDialog,
    handleEmailSentDialogClose,
    areRequiredFieldsFilled
  };
}