export interface RouteStop {
  name: string;
  location: string;
  time: string;
  type: 'pickup' | 'dropoff';
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
  carriers?: {
    id: string;
    company_name: string;
    avatar_url: string | null;
    carrier_capacities: Array<{
      price_per_kg: number;
    }>;
  };
}