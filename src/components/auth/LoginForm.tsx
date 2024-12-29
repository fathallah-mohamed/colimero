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
    handleSubmit,
  } = useLoginForm(onSuccess, requiredUserType);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <LoginFormFields
        email={email}
        password={password}
        isLoading={isLoading}
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