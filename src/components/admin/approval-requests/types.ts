export interface Client {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  phone_secondary?: string | null;
  address?: string | null;
  email_verified?: boolean;
  created_at?: string;
}

export interface Carrier {
  id: string;
  company_name: string;
  email: string;
  phone: string;
  siret?: string | null;
  address?: string | null;
  price_per_kg?: number;
  coverage_area?: string[];
  services?: string[];
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
  carrier: Carrier;
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