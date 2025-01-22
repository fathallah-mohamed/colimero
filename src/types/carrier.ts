import { Json } from "@/types/database/tables";

export interface Carrier {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  siret: string | null;
  phone: string;
  phone_secondary: string;
  address: string;
  coverage_area: string[];
  avatar_url: string;
  email_verified: boolean;
  company_details: Json;
  authorized_routes: Json;
  total_deliveries: number;
  cities_covered: number;
  status: 'pending' | 'active' | 'rejected';
  created_at: string;
  updated_at: string;
  reason?: string | null;
  password?: string | null;
}

export interface CarrierCapacity {
  carrier_id: string;
  total_capacity: number;
  price_per_kg: number;
  offers_home_delivery: boolean;
}

export interface CarrierService {
  carrier_id: string;
  service_type: string;
  icon: string;
}