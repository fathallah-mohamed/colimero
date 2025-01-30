import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { LoginFormValues } from "@/components/auth/login/LoginFormFields";

export function useActivationDialog(form: UseFormReturn<LoginFormValues>) {
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

  const handleVerificationNeeded = (email: string) => {
    console.log("Showing verification dialog for:", email);
    setShowVerificationDialog(true);
    form.reset({ email, password: "" });
  };

  const handleVerificationDialogClose = () => {
    setShowVerificationDialog(false);
  };

  return {
    showVerificationDialog,
    handleVerificationNeeded,
    handleVerificationDialogClose
  };
}