export type TourStatus = 
  | "Programmé"
  | "Préparation terminée"
  | "Ramassage en cours"
  | "Ramassage terminé"
  | "En transit"
  | "Transport terminé"
  | "Livraison en cours"
  | "Livraison terminée"
  | "Annulé";

export type TourType = "public" | "private";

export interface RouteStop {
  name: string;
  location: string;
  time: string;
  type: "pickup" | "dropoff";
  collection_date: string;
}

export interface Carrier {
  company_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  carrier_capacities?: {
    price_per_kg: number;
  }[];
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
  carriers?: Carrier;
  bookings?: Booking[];
}