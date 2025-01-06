export type TourStatus = 
  | 'planned' 
  | 'planned_completed'
  | 'collecting' 
  | 'collecting_completed'
  | 'in_transit' 
  | 'in_transit_completed'
  | 'completed'
  | 'completed_completed'
  | 'cancelled';

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
  carrier_capacities: CarrierCapacity[];
}

export interface Booking {
  id: string;
  pickup_city: string;
  delivery_city: string;
  weight: number;
  tracking_number: string;
  status: string;
  recipient_name: string;
  recipient_phone: string;
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
  bookings?: Booking[];
}