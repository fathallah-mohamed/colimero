export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'collected';

export interface BookingFormData {
  tour_id: number;
  pickup_city: string;
  delivery_city: string;
  weight: number;
  item_type: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  sender_name?: string;
  sender_phone?: string;
  package_description?: string;
  special_items?: string[];
  content_types?: string[];
  photos?: string[];
  delivery_notes?: string;
  terms_accepted: boolean;
  customs_declaration: boolean;
  status: BookingStatus;
}