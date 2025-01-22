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