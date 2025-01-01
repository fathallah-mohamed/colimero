export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      administrators: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      approval_requests: {
        Row: {
          activation_expires_at: string | null
          activation_token: string | null
          created_at: string
          email_sent: boolean | null
          id: string
          message: string | null
          reason: string | null
          status: string
          tour_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          activation_expires_at?: string | null
          activation_token?: string | null
          created_at?: string
          email_sent?: boolean | null
          id?: string
          message?: string | null
          reason?: string | null
          status: string
          tour_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          activation_expires_at?: string | null
          activation_token?: string | null
          created_at?: string
          email_sent?: boolean | null
          id?: string
          message?: string | null
          reason?: string | null
          status?: string
          tour_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          approval_request_id: string | null
          content_types: string[] | null
          created_at: string
          customs_declaration: boolean | null
          delivery_city: string
          delivery_notes: string | null
          delivery_status: string | null
          id: string
          item_type: string
          package_description: string | null
          photos: string[] | null
          pickup_city: string
          recipient_address: string
          recipient_name: string
          recipient_phone: string
          sender_name: string | null
          sender_phone: string | null
          special_items: Json | null
          status: Database["public"]["Enums"]["booking_status"]
          terms_accepted: boolean | null
          tour_id: number
          tracking_number: string
          user_id: string
          weight: number
        }
        Insert: {
          approval_request_id?: string | null
          content_types?: string[] | null
          created_at?: string
          customs_declaration?: boolean | null
          delivery_city: string
          delivery_notes?: string | null
          delivery_status?: string | null
          id?: string
          item_type: string
          package_description?: string | null
          photos?: string[] | null
          pickup_city: string
          recipient_address: string
          recipient_name: string
          recipient_phone: string
          sender_name?: string | null
          sender_phone?: string | null
          special_items?: Json | null
          status?: Database["public"]["Enums"]["booking_status"]
          terms_accepted?: boolean | null
          tour_id: number
          tracking_number: string
          user_id: string
          weight: number
        }
        Update: {
          approval_request_id?: string | null
          content_types?: string[] | null
          created_at?: string
          customs_declaration?: boolean | null
          delivery_city?: string
          delivery_notes?: string | null
          delivery_status?: string | null
          id?: string
          item_type?: string
          package_description?: string | null
          photos?: string[] | null
          pickup_city?: string
          recipient_address?: string
          recipient_name?: string
          recipient_phone?: string
          sender_name?: string | null
          sender_phone?: string | null
          special_items?: Json | null
          status?: Database["public"]["Enums"]["booking_status"]
          terms_accepted?: boolean | null
          tour_id?: number
          tracking_number?: string
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookings_approval_request_id_fkey"
            columns: ["approval_request_id"]
            isOneToOne: false
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      carrier_capacities: {
        Row: {
          carrier_id: string
          created_at: string
          id: string
          offers_home_delivery: boolean | null
          price_per_kg: number
          total_capacity: number
          updated_at: string
        }
        Insert: {
          carrier_id: string
          created_at?: string
          id?: string
          offers_home_delivery?: boolean | null
          price_per_kg?: number
          total_capacity?: number
          updated_at?: string
        }
        Update: {
          carrier_id?: string
          created_at?: string
          id?: string
          offers_home_delivery?: boolean | null
          price_per_kg?: number
          total_capacity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carrier_capacities_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: true
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
        ]
      }
      carrier_registration_requests: {
        Row: {
          address: string
          avatar_url: string | null
          company_name: string
          coverage_area: string[] | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          phone_secondary: string | null
          price_per_kg: number | null
          reason: string | null
          services: string[] | null
          siret: string
          status: string
          total_capacity: number | null
          updated_at: string
        }
        Insert: {
          address: string
          avatar_url?: string | null
          company_name: string
          coverage_area?: string[] | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          phone_secondary?: string | null
          price_per_kg?: number | null
          reason?: string | null
          services?: string[] | null
          siret: string
          status?: string
          total_capacity?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          avatar_url?: string | null
          company_name?: string
          coverage_area?: string[] | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          phone_secondary?: string | null
          price_per_kg?: number | null
          reason?: string | null
          services?: string[] | null
          siret?: string
          status?: string
          total_capacity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      carrier_services: {
        Row: {
          carrier_id: string
          created_at: string
          description: string | null
          icon: string
          id: string
          service_type: string
          updated_at: string
        }
        Insert: {
          carrier_id: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          service_type: string
          updated_at?: string
        }
        Update: {
          carrier_id?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          service_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carrier_services_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
        ]
      }
      carriers: {
        Row: {
          address: string | null
          authorized_routes: Json | null
          avatar_url: string | null
          cities_covered: number | null
          company_details: Json | null
          company_name: string | null
          coverage_area: string[] | null
          created_at: string
          customs_terms_accepted: boolean | null
          email: string | null
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          phone_secondary: string | null
          responsibility_terms_accepted: boolean | null
          siret: string | null
          status: string | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          total_deliveries: number | null
        }
        Insert: {
          address?: string | null
          authorized_routes?: Json | null
          avatar_url?: string | null
          cities_covered?: number | null
          company_details?: Json | null
          company_name?: string | null
          coverage_area?: string[] | null
          created_at?: string
          customs_terms_accepted?: boolean | null
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          phone_secondary?: string | null
          responsibility_terms_accepted?: boolean | null
          siret?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          total_deliveries?: number | null
        }
        Update: {
          address?: string | null
          authorized_routes?: Json | null
          avatar_url?: string | null
          cities_covered?: number | null
          company_details?: Json | null
          company_name?: string | null
          coverage_area?: string[] | null
          created_at?: string
          customs_terms_accepted?: boolean | null
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          phone_secondary?: string | null
          responsibility_terms_accepted?: boolean | null
          siret?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          total_deliveries?: number | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
        }
        Insert: {
          created_at?: string
          email_verified?: boolean | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
        }
        Update: {
          created_at?: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
        }
        Relationships: []
      }
      consent_types: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          label: string
          required: boolean | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          label: string
          required?: boolean | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          required?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      prohibited_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_templates: {
        Row: {
          created_at: string
          description: string | null
          icon: string
          id: string
          service_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          service_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          service_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      tours: {
        Row: {
          carrier_id: string
          collection_date: string
          created_at: string
          customs_declaration: boolean | null
          departure_country: string
          departure_date: string
          destination_country: string
          id: number
          remaining_capacity: number
          route: Json
          status: Database["public"]["Enums"]["tour_status"] | null
          terms_accepted: boolean | null
          total_capacity: number
          type: string
          updated_at: string
        }
        Insert: {
          carrier_id: string
          collection_date: string
          created_at?: string
          customs_declaration?: boolean | null
          departure_country?: string
          departure_date: string
          destination_country?: string
          id?: number
          remaining_capacity: number
          route: Json
          status?: Database["public"]["Enums"]["tour_status"] | null
          terms_accepted?: boolean | null
          total_capacity: number
          type: string
          updated_at?: string
        }
        Update: {
          carrier_id?: string
          collection_date?: string
          created_at?: string
          customs_declaration?: boolean | null
          departure_country?: string
          departure_date?: string
          destination_country?: string
          id?: number
          remaining_capacity?: number
          route?: Json
          status?: Database["public"]["Enums"]["tour_status"] | null
          terms_accepted?: boolean | null
          total_capacity?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tours_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          accepted: boolean
          accepted_at: string | null
          consent_type_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted?: boolean
          accepted_at?: string | null
          consent_type_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted?: boolean
          accepted_at?: string | null
          consent_type_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_consents_consent_type_id_fkey"
            columns: ["consent_type_id"]
            isOneToOne: false
            referencedRelation: "consent_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_test_user: {
        Args: {
          email: string
          user_type: string
          first_name: string
          last_name: string
          company_name?: string
          siret?: string
          address?: string
        }
        Returns: string
      }
      create_tours_for_carrier: {
        Args: {
          carrier_uuid: string
        }
        Returns: undefined
      }
      generate_diverse_tours: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_random_route:
        | {
            Args: Record<PropertyKey, never>
            Returns: Json
          }
        | {
            Args: {
              departure_country: string
            }
            Returns: Json
          }
      random_last_city: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      update_carrier_profile: {
        Args: {
          carrier_uuid: string
          index: number
        }
        Returns: undefined
      }
      update_carriers_with_random_avatars: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_route_structure: {
        Args: {
          route: Json
        }
        Returns: boolean
      }
    }
    Enums: {
      algerian_city: "Alger" | "Oran" | "Constantine" | "Annaba" | "Sétif"
      booking_status: "pending" | "confirmed" | "cancelled"
      french_city:
        | "Paris"
        | "Lyon"
        | "Marseille"
        | "Toulouse"
        | "Bordeaux"
        | "Montpellier"
        | "Gênes"
      moroccan_city: "Casablanca" | "Rabat" | "Tanger" | "Marrakech" | "Agadir"
      tour_status:
        | "planned"
        | "collecting"
        | "in_transit"
        | "completed"
        | "cancelled"
      tunisian_city: "Tunis" | "Sfax" | "Sousse" | "Bizerte" | "Kairouan"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
