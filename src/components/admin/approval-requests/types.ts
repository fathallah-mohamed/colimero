export interface Client {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
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
  type: string;
  carriers: {
    id: string;
    company_name: string;
    email: string;
    phone: string;
  };
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
  email?: string;
  company_name?: string;
  siret?: string;
  address?: string;
  total_capacity?: number;
  price_per_kg?: number;
  coverage_area?: string[];
  services?: string[];
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    phone_secondary?: string;
    address?: string;
    email_verified?: boolean;
    created_at?: string;
  };
}