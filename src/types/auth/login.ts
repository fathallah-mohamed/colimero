import { UserType } from "@/types/auth";

export interface LoginResponse {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
  user?: any;
}

export interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: UserType;
  onVerificationNeeded?: () => void;
}

export interface LoginFormState {
  isLoading: boolean;
  error: string | null;
  showVerificationDialog: boolean;
  showErrorDialog: boolean;
  showActivationDialog: boolean;
}