import { LoginFormFields } from "./LoginFormFields";
import { LoginFormActions } from "./LoginFormActions";
import { useLoginForm } from "@/hooks/auth/login/useLoginForm";

interface LoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  hideRegisterButton?: boolean;
}

export function LoginForm({
  onForgotPassword,
  onRegister,
  onCarrierRegister,
  onSuccess,
  requiredUserType,
  hideRegisterButton = false,
}: LoginFormProps) {
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

  return (
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
          onForgotPassword={onForgotPassword}
          onRegister={onRegister}
          onCarrierRegister={onCarrierRegister}
          requiredUserType={requiredUserType}
        />
      )}
    </form>
  );
}