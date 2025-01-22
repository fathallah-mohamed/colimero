import { Json } from "@/types/database/tables";
import { Carrier } from "@/types/carrier";

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
  carrier?: Carrier; // Made optional since it's not always present
}