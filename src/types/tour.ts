export type TourStatus = 
  | "Programmée"
  | "Ramassage en cours"
  | "En transit"
  | "Livraison en cours"
  | "Terminée"
  | "Annulée";

export type TourType = "public" | "private";

export interface RouteStop {
  name: string;
  location: string;
  time: string;
  type: "pickup" | "dropoff";
  collection_date?: string;
}

export interface Booking {
  id: number;
  recipient_name: string;
  pickup_city: string;
  delivery_city: string;
  weight: number;
  status: TourStatus;
}

export interface Tour {
  id: number;
  carrier_id: string;
  route: RouteStop[];
  total_capacity: number;
  remaining_capacity: number;
  departure_date: string;
  collection_date: string;
  created_at: string;
  updated_at: string;
  departure_country: string;
  destination_country: string;
  terms_accepted: boolean;
  customs_declaration: boolean;
  status: TourStatus;
  type: TourType;
  previous_status?: TourStatus | null;
  bookings?: Booking[];
  carriers?: {
    company_name: string;
    avatar_url: string;
    carrier_capacities: {
      price_per_kg: number;
    }
  };
}