export interface CarrierRequest {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  phone_secondary: string;
  company_name: string;
  siret: string;
  address: string;
  coverage_area: string[];
  total_capacity: number;
  price_per_kg: number;
  services: string[];
  avatar_url: string;
  company_details: any;
  authorized_routes: any;
  total_deliveries: number;
  cities_covered: number;
}

export interface AuthUser {
  user: {
    id: string;
    email: string;
  };
}