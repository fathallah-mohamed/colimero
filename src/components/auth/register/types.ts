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

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phone_secondary: string;
  address: string;
  password: string;
}

export interface RegisterFormFieldsProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phone_secondary: string;
  address: string;
  password: string;
  confirmPassword: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPhoneSecondaryChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  isLoading?: boolean;
}