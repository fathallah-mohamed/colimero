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
  carrier_id: string;
  departure_country: string;
  destination_country: string;
  departure_date: string;
  collection_date: string;
  route: Json;
  total_capacity: number;
  remaining_capacity: number;
  type: 'public' | 'private';
  created_at: string;
  updated_at: string;
  status: string;
  previous_status: string | null;
  terms_accepted: boolean | null;
  customs_declaration: boolean | null;
  tour_number: string | null;
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
  total_capacity: number | null;
  price_per_kg: number | null;
  services: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  reason: string | null;
  avatar_url: string | null;
  email_verified: boolean | null;
  company_details: Json | null;
  authorized_routes: Json | null;
  total_deliveries: number | null;
  cities_covered: number | null;
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
}