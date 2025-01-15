import { Json } from '../tables';

export interface BookingFunctions {
  cancel_booking_and_update_capacity: {
    Args: {
      booking_id: string;
    };
    Returns: void;
  };
  create_booking_with_capacity_update: {
    Args: {
      p_tour_id: number;
      p_user_id: string;
      p_weight: number;
      p_pickup_city: string;
      p_delivery_city: string;
      p_recipient_name: string;
      p_recipient_address: string;
      p_recipient_phone: string;
      p_sender_name: string;
      p_sender_phone: string;
      p_item_type: string;
      p_special_items: Json;
      p_content_types: string[];
      p_photos: string[];
    };
    Returns: string;
  };
}