export type TourStatus = 'planned' | 'collecting' | 'in_transit' | 'completed' | 'cancelled';

export interface TourStatusInfo {
  id: number;
  code: TourStatus;
  label: string;
  description: string | null;
}

export interface RouteStop {
  name: string;
  location: string;
  time: string;
  type: 'pickup' | 'dropoff';
  collection_date: string;
}

interface CarrierCapacity {
  price_per_kg: number;
}

interface Carrier {
  company_name: string | null;
  avatar_url: string | null;
  carrier_capacities?: CarrierCapacity[];
}

export interface Tour {
  id: number;
  carrier_id: string;
  route: RouteStop[];
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
  status: TourStatus | null;
  carriers?: Carrier | null;
}