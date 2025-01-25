import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { ForgotPasswordForm } from "../ForgotPasswordForm";

interface LoginFormContainerProps {
  onRegister: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  hideRegisterButton?: boolean;
}

export function LoginFormContainer({
  onRegister,
  onCarrierRegister,
  onSuccess,
  requiredUserType,
  hideRegisterButton = false,
}: LoginFormContainerProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
  };

  return (
    <>
      <LoginForm
        onForgotPassword={() => setShowForgotPassword(true)}
        onRegister={onRegister}
        onCarrierRegister={onCarrierRegister}
        onSuccess={onSuccess}
        requiredUserType={requiredUserType}
        hideRegisterButton={hideRegisterButton}
      />

      <CustomDialog
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        title="Mot de passe oublié"
      >
        <div className="p-6">
          <ForgotPasswordForm 
            onSuccess={handleForgotPasswordSuccess}
            onCancel={() => setShowForgotPassword(false)}
          />
        </div>
      </CustomDialog>
    </>
  );
}