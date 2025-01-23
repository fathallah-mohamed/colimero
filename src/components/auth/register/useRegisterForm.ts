import { useState } from "react";
import { registerClient } from "./useClientRegistration";
import { RegisterFormState } from "./types";
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

    setIsLoading(true);
    try {
      const formData: RegisterFormState = {
        firstName,
        lastName,
        email,
        phone,
        phone_secondary,
        address,
        password,
        confirmPassword,
      };

      const { success, error, type } = await registerClient(formData);

      if (!success) {
        throw new Error(error || "Une erreur est survenue lors de l'inscription");
      }

      if (type === 'existing') {
        onSuccess('existing');
        return;
      }

      // Déconnexion immédiate après l'inscription
      await supabase.auth.signOut();

      console.log('Sending activation email to:', email);
      
      // Appeler l'edge function pour envoyer l'email d'activation et attendre la réponse
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (emailError) {
        console.error('Error sending activation email:', emailError);
        throw new Error("Erreur lors de l'envoi de l'email d'activation");
      }

      console.log('Activation email sent successfully:', emailData);
      setShowEmailSentDialog(true);

    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSentDialogClose = () => {
    setShowEmailSentDialog(false);
    onSuccess('new');
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
    handleEmailSentDialogClose,
    areRequiredFieldsFilled
  };
}