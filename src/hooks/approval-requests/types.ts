import { Client, Tour } from "@/types/database/tables";

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
  client: Client;
  tour: Tour;
}

export interface FetchedApprovalRequest {
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
  user: Client[];
  tour: {
    id: number;
    departure_country: string;
    destination_country: string;
    departure_date: string;
    collection_date: string;
    route: any[];
    total_capacity: number;
    remaining_capacity: number;
    type: string;
    carrier: {
      id: string;
      company_name: string;
      email: string;
      phone: string;
    };
  };
}