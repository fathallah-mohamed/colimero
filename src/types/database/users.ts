export interface UserTables {
  clients: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    created_at: string;
    email_verified: boolean | null;
    terms_accepted: boolean | null;
    terms_accepted_at: string | null;
    email: string | null;
    status: string;
  };

  commitment_types: {
    id: string;
    code: string;
    label: string;
    description: string;
    created_at: string;
    updated_at: string;
  };

  consent_types: {
    id: string;
    code: string;
    label: string;
    description: string | null;
    required: boolean | null;
    created_at: string;
    updated_at: string;
  };

  user_consents: {
    id: string;
    user_id: string;
    consent_type_id: string;
    accepted: boolean;
    accepted_at: string | null;
    created_at: string;
    updated_at: string;
  };
}