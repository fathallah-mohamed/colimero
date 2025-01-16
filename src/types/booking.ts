export type BookingStatus = "pending" | "confirmed" | "cancelled" | "collected" | "in_transit";
export type BookingFilterStatus = BookingStatus | "all";

export interface Booking {
  id: string;
  user_id: string;
  tour_id: number;
  pickup_city: string;
  delivery_city: string;
  tracking_number: string;
  created_at: string;
  weight: number;
  item_type: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  sender_name: string | null;
  sender_phone: string | null;
  status: BookingStatus;
  delivery_status: string | null;
  special_items: Array<{ name: string; quantity: number }>;
  content_types?: string[];
  photos?: string[];
  package_description?: string;
  created_at_formatted?: string;
  departure_date_formatted?: string | null;
  collection_date_formatted?: string | null;
  sender_email?: string;
  recipient_email?: string;
  tours?: {
    collection_date: string;
    departure_date: string;
    destination_country: string;
    route: any;
    status: string;
    carriers?: {
      company_name: string;
      avatar_url: string;
      phone: string;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}