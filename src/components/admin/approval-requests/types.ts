import { Json } from "@/integrations/supabase/types";

export interface Client {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
}

export interface Carrier {
  id: string;
  company_name: string;
  email: string;
  phone: string;
}

export interface Tour {
  id: number;
  departure_country: string;
  destination_country: string;
  departure_date: string;
  collection_date: string;
  route: any[];
  total_capacity: number;
  remaining_capacity: number;
  type: "public" | "private";
  carriers: Carrier;
}

export interface ApprovalRequest {
  id: string;
  status: string;
  tour: Tour;
  client: Client;
  created_at: string;
  updated_at: string;
  message: string | null;
  reason: string | null;
  email_sent: boolean | null;
  activation_token: string | null;
  activation_expires_at: string | null;
  pickup_city: string;
  tour_id: number;
  user_id: string;
}