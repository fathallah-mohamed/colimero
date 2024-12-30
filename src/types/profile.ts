export interface ProfileData {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  company_name?: string;
  siret?: string;
  address?: string;
  coverage_area?: string[];
  avatar_url?: string | null;
  terms_accepted?: boolean;
  terms_accepted_at?: string;
  customs_terms_accepted?: boolean;
  responsibility_terms_accepted?: boolean;
  carrier_capacities?: {
    total_capacity: number;
    price_per_kg: number;
    offers_home_delivery?: boolean;
  };
  carrier_services?: Array<{
    service_type: string;
    icon: string;
  }>;
}