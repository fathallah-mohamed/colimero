export type TourStatus = 'planned' | 'collecting' | 'in_transit' | 'completed' | 'cancelled';

export interface RouteStop {
  name: string;
  location: string;
  time: string;
  type: 'pickup' | 'dropoff';
  collection_date: string;
}

export interface Tour {
  id: number;
  carrier_id: string;
  route: RouteStop[];
  total_capacity: number;
  remaining_capacity: number;
  type: 'public' | 'private';
  departure_date: string;
  collection_date: string;
  created_at: string;
  updated_at: string;
  departure_country: string;
  destination_country: string;
  terms_accepted: boolean | null;
  customs_declaration: boolean | null;
  status: TourStatus;
  title?: string;
  pickup_city?: string;
}