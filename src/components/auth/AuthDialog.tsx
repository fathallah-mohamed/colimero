import { LoginFormContainer } from "./login/LoginFormContainer";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { useState } from "react";
import { CustomDialog } from "../ui/custom-dialog";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
  requiredUserType?: "client" | "carrier";
}

export default function AuthDialog({
  isOpen,
  onClose,
  onSuccess,
  onRegisterClick,
  onCarrierRegisterClick,
  requiredUserType,
}: AuthDialogProps) {
  return (
    <CustomDialog 
      open={isOpen} 
      onClose={onClose}
      title="Connexion"
      className="sm:max-w-[500px]"
    >
      <div className="p-6">
        <LoginFormContainer
          onRegister={onRegisterClick}
          onCarrierRegister={onCarrierRegisterClick}
          onSuccess={onSuccess}
          requiredUserType={requiredUserType}
        />
      </div>
    </CustomDialog>
  );
}