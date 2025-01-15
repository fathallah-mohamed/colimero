import { Json } from '../tables';

export interface TourFunctions {
  create_test_tours_for_carriers: {
    Args: Record<PropertyKey, never>;
    Returns: undefined;
  };
  create_tours_for_carrier: {
    Args: {
      carrier_uuid: string;
    };
    Returns: undefined;
  };
  create_tours_for_specific_carrier: {
    Args: {
      carrier_email: string;
    };
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
  validate_route_structure: {
    Args: {
      route: Json;
    };
    Returns: boolean;
  };
}