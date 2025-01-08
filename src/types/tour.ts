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
  id: string;
  user_id: string;
  tour_id: number;
  recipient_name: string;
  pickup_city: string;
  delivery_city: string;
  weight: number;
  tracking_number: string;
  status: string;
  recipient_phone: string;
  recipient_address: string;
  item_type: string;
  sender_name?: string;
  sender_phone?: string;
  special_items?: any[];
  content_types?: string[];
  package_description?: string;
  created_at: string;
  updated_at?: string;
  terms_accepted: boolean;
  customs_declaration: boolean;
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
  status: TourStatus;
  type: TourType;
  previous_status?: TourStatus | null;
  bookings?: Booking[];
  terms_accepted: boolean;
  customs_declaration: boolean;
  carriers?: {
    company_name: string;
    avatar_url: string;
    carrier_capacities: {
      price_per_kg: number;
    }
  };
}