export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  company_name?: string;
  siret?: string;
  phone_secondary?: string;
  avatar_url?: string;
  created_at?: string;
  carrier_services?: Array<{
    service_type: string;
    icon: string;
  }>;
  carrier_capacities?: {
    total_capacity: number;
    price_per_kg: number;
  };
}