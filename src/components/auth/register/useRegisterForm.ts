import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RegisterFormState, RegisterFormData } from "./types";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areRequiredFieldsFilled()) return;

    try {
      setIsLoading(true);
      console.log("Starting registration process...");

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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
      console.log("Auth signup successful:", signUpData);

      if (!signUpData.user) {
        throw new Error("No user data received");
      }

      const { error: insertError } = await supabase
        .from('clients')
        .insert({
          id: signUpData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          phone_secondary,
          address,
          email_verified: false,
        });

      if (insertError) throw insertError;
      console.log("Client profile created successfully");

      setShowEmailSentDialog(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
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