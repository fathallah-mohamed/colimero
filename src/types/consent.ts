export interface ConsentType {
  id: string;
  code: string;
  label: string;
  description: string | null;
  required: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserConsent {
  id: string;
  user_id: string;
  consent_type_id: string;
  accepted: boolean;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
}