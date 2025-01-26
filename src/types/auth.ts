export interface LoginFormValues {
  email: string;
  password: string;
}

export type UserType = 'client' | 'carrier' | 'admin';

export interface LoginResponse {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
  user?: any;
}

export interface LoginState {
  isLoading: boolean;
  error: string | null;
  showVerificationDialog: boolean;
  showErrorDialog: boolean;
  showActivationDialog: boolean;
}

export interface LoginHookProps {
  onSuccess?: () => void;
  requiredUserType?: UserType;
  onVerificationNeeded?: () => void;
}