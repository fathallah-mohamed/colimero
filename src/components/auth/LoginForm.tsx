import { useLoginForm } from "./login/useLoginForm";
import { LoginFormFields } from "./login/LoginFormFields";
import { LoginFormActions } from "./login/LoginFormActions";

interface LoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  onRegisterClick?: () => void;
  isBookingFlow?: boolean;
  isCreateTourFlow?: boolean;
}

export default function LoginForm({ 
  onSuccess, 
  requiredUserType,
  onRegisterClick,
  isBookingFlow,
  isCreateTourFlow
}: LoginFormProps) {
  const { 
    isLoading, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    error, 
    handleSubmit 
  } = useLoginForm({ onSuccess, requiredUserType });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LoginFormFields 
        email={email}
        password={password}
        isLoading={isLoading}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
      />
      <LoginFormActions 
        onRegisterClick={onRegisterClick}
        isBookingFlow={isBookingFlow}
        isCreateTourFlow={isCreateTourFlow}
      />
    </form>
  );
}