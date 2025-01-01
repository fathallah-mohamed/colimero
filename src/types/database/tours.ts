import { Json } from './tables';

export interface TourTables {
  tour_statuses: {
    id: number;
    code: string;
    label: string;
    description: string | null;
    created_at: string;
  };

  tours: {
    id: number;
    carrier_id: string;
    route: Json;
    total_capacity: number;
    remaining_capacity: number;
    type: string;
    departure_date: string;
    collection_date: string;
    created_at: string;
    updated_at: string;
    departure_country: string;
    destination_country: string;
    terms_accepted: boolean | null;
    customs_declaration: boolean | null;
    status: string | null;
  };
}