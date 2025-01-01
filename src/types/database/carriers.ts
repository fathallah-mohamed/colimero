import { Json } from './tables';

export interface CarrierTables {
  carrier_capacities: {
    id: string;
    carrier_id: string;
    total_capacity: number;
    price_per_kg: number;
    offers_home_delivery: boolean | null;
    created_at: string;
    updated_at: string;
  };

  carrier_commitments: {
    id: string;
    carrier_id: string;
    commitment_type_id: string;
    accepted: boolean;
    accepted_at: string | null;
    created_at: string;
    updated_at: string;
  };

  carrier_registration_requests: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    company_name: string;
    siret: string;
    phone: string;
    phone_secondary: string | null;
    address: string;
    coverage_area: string[] | null;
    total_capacity: number | null;
    price_per_kg: number | null;
    services: string[] | null;
    status: string;
    created_at: string;
    updated_at: string;
    reason: string | null;
    avatar_url: string | null;
  };

  carrier_services: {
    id: string;
    carrier_id: string;
    service_type: string;
    created_at: string;
    updated_at: string;
    description: string | null;
    icon: string;
  };

  carriers: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    company_name: string | null;
    siret: string | null;
    address: string | null;
    created_at: string;
    email_verified: boolean | null;
    company_details: Json | null;
    avatar_url: string | null;
    authorized_routes: Json | null;
    phone_secondary: string | null;
    coverage_area: string[] | null;
    email: string | null;
    total_deliveries: number | null;
    cities_covered: number | null;
    status: string | null;
  };
}