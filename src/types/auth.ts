export type UserType = 'client' | 'carrier' | 'admin';

export interface RegisterFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phone_secondary?: string;
  address: string;
  password: string;
  confirmPassword: string;
}