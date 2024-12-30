import { LoginFormFields } from "./login/LoginFormFields";
import { LoginFormActions } from "./login/LoginFormActions";
import { useLoginForm } from "./login/useLoginForm";

interface LoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
}

export function LoginForm({
  onForgotPassword,
  onRegister,
  onSuccess,
  requiredUserType
}: LoginFormProps) {
  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  } = useLoginForm(onSuccess, requiredUserType);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LoginFormFields
        email={email}
        password={password}
        isLoading={isLoading}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
      />

      <LoginFormActions
        isLoading={isLoading}
        onForgotPassword={onForgotPassword}
        onRegister={onRegister}
      />
    </form>
  );
}