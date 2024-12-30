export interface ConsentType {
  id: string;
  code: string;
  label: string;
  description: string | null;
  required: boolean;
}

export interface UserConsent {
  id: string;
  userId: string;
  consentTypeId: string;
  accepted: boolean;
  acceptedAt: string | null;
}