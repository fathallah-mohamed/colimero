export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'collected' | 'in_transit' | 'delivered' | 'cancelled';

export type BookingFilterStatus = BookingStatus | 'all';

export interface FormData {
  sender_name: string;
  sender_phone: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  delivery_city: string;
}

export interface BookingFormState {
  weight: number;
  selectedContentTypes: string[];
  selectedSpecialItems: string[];
  itemQuantities: Record<string, number>;
  photos: File[];
  formData: FormData;
}

export interface BookingFormData {
  weight: number;
  pickup_city: string;
  delivery_city: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  sender_name: string;
  sender_phone: string;
  item_type?: string;
  special_items?: any[];
  content_types?: string[];
  photos?: File[];
}

export interface Booking {
  id: string;
  user_id: string;
  tour_id: number;
  pickup_city: string;
  delivery_city: string;
  tracking_number: string;
  weight: number;
  status: BookingStatus;
  item_type: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  delivery_notes?: string;
  terms_accepted: boolean;
  customs_declaration: boolean;
  package_description?: string;
  special_items?: any[];
  content_types?: string[];
  photos?: string[];
  sender_name?: string;
  sender_phone?: string;
  created_at: string;
  updated_at?: string;
  tours?: {
    collection_date: string;
    departure_date: string;
    destination_country: string;
    carriers?: {
      company_name: string | null;
      avatar_url: string | null;
      phone: string | null;
    };
  };
}

export interface BookingDetailsProps {
  booking: Booking;
}