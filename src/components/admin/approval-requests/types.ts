import { Json } from "@/types/database/tables";

export interface ApprovalRequest {
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