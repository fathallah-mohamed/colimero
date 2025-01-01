export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Tables {
  administrators: {
    id: string;
    email: string;
    created_at: string;
  };
  
  approval_requests: {
    id: string;
    user_id: string;
    tour_id: number;
    status: string;
    message: string | null;
    created_at: string;
    updated_at: string;
    reason: string | null;
    email_sent: boolean | null;
    activation_token: string | null;
    activation_expires_at: string | null;
  };

  booking_statuses: {
    id: number;
    code: string;
    label: string;
    description: string | null;
    created_at: string;
  };

  bookings: {
    id: string;
    user_id: string;
    tour_id: number;
    pickup_city: string;
    tracking_number: string;
    created_at: string;
    weight: number;
    item_type: string;
    recipient_name: string;
    recipient_address: string;
    recipient_phone: string;
    approval_request_id: string | null;
    delivery_status: string | null;
    delivery_notes: string | null;
    terms_accepted: boolean | null;
    customs_declaration: boolean | null;
    package_description: string | null;
    special_items: Json | null;
    content_types: string[] | null;
    photos: string[] | null;
    sender_name: string | null;
    sender_phone: string | null;
    delivery_city: string;
    status: string;
  };
}