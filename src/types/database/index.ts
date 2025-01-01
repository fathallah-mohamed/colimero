import type { Tables as BaseTables } from './tables';
import type { CarrierTables } from './carriers';
import type { TourTables } from './tours';
import type { UserTables } from './users';
import type { ItemTables } from './items';
import type { Json } from './tables';

export interface Database {
  public: {
    Tables: BaseTables & CarrierTables & TourTables & UserTables & ItemTables;
    Views: {
      [_ in never]: never;
    };
    Functions: {
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
    };
    Enums: {
      algerian_city: "Alger" | "Oran" | "Constantine" | "Annaba" | "Sétif";
      booking_status: "pending" | "confirmed" | "cancelled" | "collected" | "in_transit";
      french_city: "Paris" | "Lyon" | "Marseille" | "Toulouse" | "Bordeaux" | "Montpellier" | "Gênes";
      moroccan_city: "Casablanca" | "Rabat" | "Tanger" | "Marrakech" | "Agadir";
      tour_status: "planned" | "collecting" | "in_transit" | "completed" | "cancelled";
      tunisian_city: "Tunis" | "Sfax" | "Sousse" | "Bizerte" | "Kairouan";
    };
  };
}

export type { Json } from './tables';
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];