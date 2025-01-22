import { Json } from "@/types/database/tables";

export interface Carrier {
  id: string;
  company_name: string;
  email: string;
  phone: string;
}

export interface Tour {
  id: number;
  carrier: Carrier;
  departure_country: string;
  destination_country: string;
  departure_date: string;
  collection_date: string;
  route: Json;
  total_capacity: number;
  remaining_capacity: number;
  type: 'public' | 'private';
  status: string | null;
  previous_status: string | null;
  terms_accepted: boolean | null;
  customs_declaration: boolean | null;
  tour_number: string | null;
  carrier_id: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
}

export interface CarrierRegistrationRequest {
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
  total_capacity: number;
  price_per_kg: number;
  services: string[];
  status: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  email_verified: boolean;
  company_details: Json;
  authorized_routes: Json;
  total_deliveries: number;
  cities_covered: number;
}

export interface ApprovalRequest {
  id: string;
  user_id: string;
  tour_id: number;
  status: string;
  message: string | null;
  created_at: string;
  updated_at: string;
  reason: string | null;
  email_sent: boolean | null;
  activation_token: string | null;
  activation_expires_at: string | null;
  pickup_city: string;
  tour: Tour;
  client: Client;
  company_name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}