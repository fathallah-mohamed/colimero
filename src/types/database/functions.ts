import { Json } from './tables';

export interface DatabaseFunctions {
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
  sync_user_verification: {
    Args: {
      user_id: string;
      is_verified: boolean;
    };
    Returns: void;
  };
  create_test_user: {
    Args: {
      email: string;
      user_type: string;
      first_name: string;
      last_name: string;
      company_name?: string;
      siret?: string;
      address?: string;
    };
    Returns: string;
  };
  create_tours_for_carrier: {
    Args: {
      carrier_uuid: string;
    };
    Returns: undefined;
  };
  generate_diverse_tours: {
    Args: Record<PropertyKey, never>;
    Returns: undefined;
  };
  generate_random_route:
    | {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      }
    | {
        Args: {
          departure_country: string;
        };
        Returns: Json;
      };
  random_last_city: {
    Args: Record<PropertyKey, never>;
    Returns: Json;
  };
  update_carrier_profile: {
    Args: {
      carrier_uuid: string;
      index: number;
    };
    Returns: undefined;
  };
  update_carriers_with_random_avatars: {
    Args: Record<PropertyKey, never>;
    Returns: undefined;
  };
  validate_route_structure: {
    Args: {
      route: Json;
    };
    Returns: boolean;
  };
}