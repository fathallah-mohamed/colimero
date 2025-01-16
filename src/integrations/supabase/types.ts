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
          address: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
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
          pickup_city: string
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
          pickup_city: string
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
          pickup_city?: string
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
          {
            foreignKeyName: "fk_approval_requests_clients"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "client_consents"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "fk_approval_requests_clients"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_statuses: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: number
          label: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: number
          label: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: number
          label?: string
        }
        Relationships: []
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
          recipient_id: string | null
          recipient_name: string
          recipient_phone: string
          sender_name: string | null
          sender_phone: string | null
          special_items: Json | null
          status: string
          terms_accepted: boolean | null
          tour_id: number
          tracking_number: string
          updated_at: string | null
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
          recipient_id?: string | null
          recipient_name: string
          recipient_phone: string
          sender_name?: string | null
          sender_phone?: string | null
          special_items?: Json | null
          status?: string
          terms_accepted?: boolean | null
          tour_id: number
          tracking_number: string
          updated_at?: string | null
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
          recipient_id?: string | null
          recipient_name?: string
          recipient_phone?: string
          sender_name?: string | null
          sender_phone?: string | null
          special_items?: Json | null
          status?: string
          terms_accepted?: boolean | null
          tour_id?: number
          tracking_number?: string
          updated_at?: string | null
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
            foreignKeyName: "bookings_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "client_consents"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "bookings_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_booking_status"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "booking_statuses"
            referencedColumns: ["code"]
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
      carrier_commitments: {
        Row: {
          accepted: boolean
          accepted_at: string | null
          carrier_id: string
          commitment_type_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          accepted?: boolean
          accepted_at?: string | null
          carrier_id: string
          commitment_type_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          accepted?: boolean
          accepted_at?: string | null
          carrier_id?: string
          commitment_type_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carrier_commitments_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carrier_commitments_commitment_type_id_fkey"
            columns: ["commitment_type_id"]
            isOneToOne: false
            referencedRelation: "commitment_types"
            referencedColumns: ["id"]
          },
        ]
      }
      carrier_registration_requests: {
        Row: {
          address: string
          authorized_routes: Json | null
          avatar_url: string | null
          cities_covered: number | null
          company_details: Json | null
          company_name: string
          coverage_area: string[]
          created_at: string
          email: string
          email_verified: boolean | null
          first_name: string
          id: string
          last_name: string
          password: string | null
          phone: string
          phone_secondary: string | null
          price_per_kg: number | null
          reason: string | null
          services: string[] | null
          siret: string | null
          status: string
          total_capacity: number | null
          total_deliveries: number | null
          updated_at: string
        }
        Insert: {
          address: string
          authorized_routes?: Json | null
          avatar_url?: string | null
          cities_covered?: number | null
          company_details?: Json | null
          company_name: string
          coverage_area?: string[]
          created_at?: string
          email: string
          email_verified?: boolean | null
          first_name: string
          id?: string
          last_name: string
          password?: string | null
          phone: string
          phone_secondary?: string | null
          price_per_kg?: number | null
          reason?: string | null
          services?: string[] | null
          siret?: string | null
          status?: string
          total_capacity?: number | null
          total_deliveries?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          authorized_routes?: Json | null
          avatar_url?: string | null
          cities_covered?: number | null
          company_details?: Json | null
          company_name?: string
          coverage_area?: string[]
          created_at?: string
          email?: string
          email_verified?: boolean | null
          first_name?: string
          id?: string
          last_name?: string
          password?: string | null
          phone?: string
          phone_secondary?: string | null
          price_per_kg?: number | null
          reason?: string | null
          services?: string[] | null
          siret?: string | null
          status?: string
          total_capacity?: number | null
          total_deliveries?: number | null
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
          address: string
          authorized_routes: Json
          avatar_url: string
          cities_covered: number
          company_details: Json
          company_name: string
          coverage_area: string[]
          created_at: string
          email: string
          email_verified: boolean
          first_name: string
          id: string
          id_document: string | null
          last_name: string
          phone: string
          phone_secondary: string
          siret: string | null
          status: string
          total_deliveries: number
        }
        Insert: {
          address: string
          authorized_routes?: Json
          avatar_url?: string
          cities_covered?: number
          company_details?: Json
          company_name: string
          coverage_area?: string[]
          created_at?: string
          email: string
          email_verified?: boolean
          first_name: string
          id: string
          id_document?: string | null
          last_name: string
          phone: string
          phone_secondary?: string
          siret?: string | null
          status?: string
          total_deliveries?: number
        }
        Update: {
          address?: string
          authorized_routes?: Json
          avatar_url?: string
          cities_covered?: number
          company_details?: Json
          company_name?: string
          coverage_area?: string[]
          created_at?: string
          email?: string
          email_verified?: boolean
          first_name?: string
          id?: string
          id_document?: string | null
          last_name?: string
          phone?: string
          phone_secondary?: string
          siret?: string | null
          status?: string
          total_deliveries?: number
        }
        Relationships: []
      }
      clients: {
        Row: {
          activation_expires_at: string | null
          activation_token: string | null
          address: string | null
          created_at: string
          email: string
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
        }
        Insert: {
          activation_expires_at?: string | null
          activation_token?: string | null
          address?: string | null
          created_at?: string
          email: string
          email_verified?: boolean | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
        }
        Update: {
          activation_expires_at?: string | null
          activation_token?: string | null
          address?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      commitment_types: {
        Row: {
          code: string
          created_at: string
          description: string
          id: string
          label: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          id?: string
          label: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          id?: string
          label?: string
          updated_at?: string
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
      email_logs: {
        Row: {
          created_at: string
          email: string
          email_type: string
          error_message: string | null
          id: string
          sent_at: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          email_type?: string
          error_message?: string | null
          id?: string
          sent_at?: string
          status: string
        }
        Update: {
          created_at?: string
          email?: string
          email_type?: string
          error_message?: string | null
          id?: string
          sent_at?: string
          status?: string
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
      tour_statuses: {
        Row: {
          created_at: string
          display_order: number | null
          id: number
          is_final: boolean
          name: string
          parent_status_id: number | null
          status_type: Database["public"]["Enums"]["status_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: number
          is_final?: boolean
          name: string
          parent_status_id?: number | null
          status_type?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: number
          is_final?: boolean
          name?: string
          parent_status_id?: number | null
          status_type?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_statuses_parent_status_id_fkey"
            columns: ["parent_status_id"]
            isOneToOne: false
            referencedRelation: "tour_statuses"
            referencedColumns: ["id"]
          },
        ]
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
          previous_status: string | null
          remaining_capacity: number
          route: Json
          status: string | null
          terms_accepted: boolean | null
          total_capacity: number
          tour_number: string
          type: Database["public"]["Enums"]["tour_type"]
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
          previous_status?: string | null
          remaining_capacity: number
          route: Json
          status?: string | null
          terms_accepted?: boolean | null
          total_capacity: number
          tour_number: string
          type?: Database["public"]["Enums"]["tour_type"]
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
          previous_status?: string | null
          remaining_capacity?: number
          route?: Json
          status?: string | null
          terms_accepted?: boolean | null
          total_capacity?: number
          tour_number?: string
          type?: Database["public"]["Enums"]["tour_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tour_status"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "tour_statuses"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "tours_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tours_previous_status_fkey"
            columns: ["previous_status"]
            isOneToOne: false
            referencedRelation: "tour_statuses"
            referencedColumns: ["name"]
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
      client_consents: {
        Row: {
          accepted: boolean | null
          accepted_at: string | null
          client_id: string | null
          consent_type_id: string | null
          email: string | null
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
    Functions: {
      cancel_booking_and_update_capacity: {
        Args: {
          booking_id: string
        }
        Returns: undefined
      }
      create_booking_with_capacity_update: {
        Args: {
          p_tour_id: number
          p_user_id: string
          p_weight: number
          p_pickup_city: string
          p_delivery_city: string
          p_recipient_name: string
          p_recipient_address: string
          p_recipient_phone: string
          p_sender_name: string
          p_sender_phone: string
          p_item_type: string
          p_special_items: Json
          p_content_types: string[]
          p_photos: string[]
        }
        Returns: string
      }
      create_test_tours_for_carriers: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
      create_tours_for_specific_carrier: {
        Args: {
          carrier_email: string
        }
        Returns: undefined
      }
      generate_company_name: {
        Args: {
          id: string
        }
        Returns: string
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
      generate_test_bookings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_tours_with_all_statuses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
      booking_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "collected"
        | "in_transit"
      french_city:
        | "Paris"
        | "Lyon"
        | "Marseille"
        | "Toulouse"
        | "Bordeaux"
        | "Montpellier"
        | "Gênes"
      maghreb_country: "TN" | "MA" | "DZ"
      moroccan_city: "Casablanca" | "Rabat" | "Tanger" | "Marrakech" | "Agadir"
      registration_status: "pending" | "approved" | "rejected"
      status_type: "en_cours" | "terminé" | "annulé"
      tour_status:
        | "planned"
        | "collecting"
        | "in_transit"
        | "completed"
        | "cancelled"
      tour_type: "public" | "private"
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
