import { useState } from "react";
import { LoginFormFields } from "./login/LoginFormFields";
import { LoginFormActions } from "./login/LoginFormActions";
import { useLoginForm } from "./login/useLoginForm";

interface LoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier' | 'admin';
}

export function LoginForm({
  onForgotPassword,
  onRegister,
  onCarrierRegister,
  onSuccess,
  requiredUserType,
}: LoginFormProps) {
  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  } = useLoginForm(onSuccess);

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
        onCarrierRegister={onCarrierRegister}
        requiredUserType={requiredUserType}
      />
    </form>
  );
}