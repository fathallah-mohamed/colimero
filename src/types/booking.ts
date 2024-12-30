export interface BookingFormData {
  tour_id: number;
  user_id: string;
  pickup_city: string;
  weight: number;
  content_types: string[];
  special_items: string[];
  photos: string[];
  sender_name: string;
  sender_phone: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  status: string;
  tracking_number: string;
  item_type: string;
}