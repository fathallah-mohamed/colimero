export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'collected';

export interface BookingFormState {
  weight: number;
  selectedContentTypes: string[];
  selectedSpecialItems: string[];
  itemQuantities: Record<string, number>;
  photos: File[];
  formData: {
    senderName: string;
    senderPhone: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    deliveryCity: string;
  };
}

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
  tracking_number: string;
}