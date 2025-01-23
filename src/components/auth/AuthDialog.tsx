import { LoginForm } from "./LoginForm";
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <CustomDialog 
      open={isOpen} 
      onClose={onClose}
      title={showForgotPassword ? "Réinitialisation du mot de passe" : "Connexion"}
      className="sm:max-w-[500px]"
    >
      <div className="p-6">
        {showForgotPassword ? (
          <div className="space-y-4">
            <ForgotPasswordForm 
              onCancel={() => setShowForgotPassword(false)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <LoginForm
              onSuccess={onSuccess}
              onForgotPassword={() => setShowForgotPassword(true)}
              onRegister={onRegisterClick}
              onCarrierRegister={onCarrierRegisterClick}
              requiredUserType={requiredUserType}
            />
          </div>
        )}
      </div>
    </CustomDialog>
  );
}