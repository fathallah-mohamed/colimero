export type BookingStatus = 'pending' | 'confirmed' | 'collected' | 'in_transit' | 'cancelled';

export interface BookingStatusInfo {
  id: number;
  code: BookingStatus;
  label: string;
  description: string | null;
}

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
  recipient_address: string;
  recipient_phone: string;
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
}

export type BookingFormData = Omit<Booking, 'id' | 'created_at'>;
