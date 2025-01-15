export interface RegisterFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address?: string;
}

export interface UseRegisterFormReturn extends RegisterFormState {
  isLoading: boolean;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setAddress: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  areRequiredFieldsFilled: () => boolean;
}