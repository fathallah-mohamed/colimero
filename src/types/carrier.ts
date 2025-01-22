export interface Carrier {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  siret: string | null;
  phone: string;
  phone_secondary: string | null;
  address: string;
  coverage_area: string[];
  avatar_url: string | null;
  email_verified: boolean;
  company_details: any;
  authorized_routes: any;
  total_deliveries: number;
  cities_covered: number;
  status: 'pending' | 'active' | 'rejected';
  created_at: string;
  updated_at: string;
  reason?: string | null;
  password?: string | null;
  total_capacity?: number;
  price_per_kg?: number;
  services?: string[];
}