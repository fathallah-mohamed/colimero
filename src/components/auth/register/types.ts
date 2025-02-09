export interface RegisterFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phone_secondary: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export type RegistrationType = 'new' | 'existing';

export interface RegistrationResult {
  success: boolean;
  type?: RegistrationType;
  error?: string;
  needsVerification?: boolean;
  email?: string;
}