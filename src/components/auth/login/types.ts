import { UseFormReturn } from "react-hook-form";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormFieldsProps {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  hideRegisterButton?: boolean;
}