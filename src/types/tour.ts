export type TourStatus = 
  | 'planned'
  | 'collecting'
  | 'collecting_completed'
  | 'in_transit'
  | 'transport_completed'
  | 'delivery_in_progress'
  | 'completed_completed'
  | 'cancelled';

export type TourType = 'public' | 'private';

export interface Tour {
  id: number;
  carrier_id: string;
  route: any[];
  total_capacity: number;
  remaining_capacity: number;
  type: TourType;
  departure_date: string;
  collection_date: string;
  created_at: string;
  updated_at: string;
  departure_country: string;
  destination_country: string;
  terms_accepted?: boolean;
  customs_declaration?: boolean;
  status: TourStatus;
  carriers?: {
    company_name: string;
    avatar_url: string;
    carrier_capacities?: {
      price_per_kg: number;
    }[];
  };
  bookings?: any[];
}