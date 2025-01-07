export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'collected' | 'in_transit' | 'delivered' | 'cancelled';

export interface BookingFormData {
  user_id: string;
  tour_id: number;
  weight: number;
  pickup_city: string;
  delivery_city: string;
  tracking_number: string;
  status: BookingStatus;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  sender_name: string;
  sender_phone: string;
  item_type: string;
  special_items?: string;
  content_types: string[];
  photos: File[];
}