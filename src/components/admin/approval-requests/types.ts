import { Json } from "@/types/database/tables";

export interface Tour {
  id: number;
  carrier_id: string;
  route: Json;
  total_capacity: number;
  remaining_capacity: number;
  departure_date: string;
  collection_date: string;
  created_at: string;
  updated_at: string;
  departure_country: string;
  destination_country: string;
  status: string;
  type: "public" | "private";
  previous_status: string | null;
  terms_accepted: boolean;
  customs_declaration: boolean;
  tour_number: string | null;
  carrier: {
    id: string;
    company_name: string;
    email: string;
    phone: string;
  };
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
  reason: string | null;
  created_at: string;
  updated_at: string;
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
  company_name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}