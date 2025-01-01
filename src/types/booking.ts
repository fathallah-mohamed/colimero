export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'collected' | 'in_transit';

export interface FormData {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  deliveryCity: string;
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
  tour_id: number;
  user_id: string;
  pickup_city: string;
  delivery_city: string;
  weight: number;
  item_type: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  sender_name: string;
  sender_phone: string;
  special_items: string[];
  content_types: string[];
  photos: string[];
  terms_accepted: boolean;
  customs_declaration: boolean;
  tracking_number: string;
  status: BookingStatus;
}