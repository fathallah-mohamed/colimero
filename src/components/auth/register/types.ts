export interface RegisterFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  address: string;
  idDocument: File | null;
  acceptedConsents: string[];
}

export interface UseRegisterFormReturn extends RegisterFormState {
  isLoading: boolean;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setBirthDate: (value: string) => void;
  setAddress: (value: string) => void;
  setIdDocument: (file: File | null) => void;
  handleConsentChange: (consentId: string, accepted: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  requiredConsentsCount: number;
  allRequiredConsentsAccepted: boolean;
  areRequiredFieldsFilled: () => boolean;
}