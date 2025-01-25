import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { ForgotPasswordForm } from "../ForgotPasswordForm";
import { LoginFormFields } from "./LoginFormFields";
import { LoginFormActions } from "./LoginFormActions";
import { useLoginForm } from "@/hooks/auth/login/useLoginForm";

interface LoginFormProps {
  onForgotPassword?: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  hideRegisterButton?: boolean;
}

export function LoginForm({
  onRegister,
  onCarrierRegister,
  onSuccess,
  requiredUserType,
  hideRegisterButton = false,
}: LoginFormProps) {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    error,
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleSubmit,
  } = useLoginForm({ 
    onSuccess, 
    requiredUserType,
    onVerificationNeeded: () => {
      setShowVerificationDialog(true);
      setPassword("");
    }
  });

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <LoginFormFields
          email={email}
          password={password}
          isLoading={isLoading}
          error={error}
          showVerificationDialog={showVerificationDialog}
          showErrorDialog={showErrorDialog}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onVerificationDialogClose={() => setShowVerificationDialog(false)}
          onErrorDialogClose={() => setShowErrorDialog(false)}
        />

        {!hideRegisterButton && (
          <LoginFormActions
            isLoading={isLoading}
            onForgotPassword={() => setShowForgotPassword(true)}
            onRegister={onRegister}
            onCarrierRegister={onCarrierRegister}
            requiredUserType={requiredUserType}
          />
        )}
      </form>

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