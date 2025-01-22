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