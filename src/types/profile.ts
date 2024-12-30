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
  carrier_capacities?: {
    total_capacity: number;
    price_per_kg: number;
  };
  carrier_services?: Array<{
    service_type: string;
    icon: string;
  }>;
}