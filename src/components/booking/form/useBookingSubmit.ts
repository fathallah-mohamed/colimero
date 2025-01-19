import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useBookingSubmit(tourId: number) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data: result, error } = await supabase.rpc(
        'create_booking_with_capacity_update',
        {
          p_tour_id: tourId,
          p_user_id: user.id,
          p_weight: data.weight,
          p_pickup_city: data.pickup_city,
          p_delivery_city: data.delivery_city,
          p_recipient_name: data.recipient_name,
          p_recipient_address: data.recipient_address,
          p_recipient_phone: data.recipient_phone,
          p_sender_name: data.sender_name,
          p_sender_phone: data.sender_phone,
          p_item_type: data.item_type,
          p_special_items: data.special_items,
          p_content_types: data.content_types,
          p_photos: data.photos || []
        }
      );

      if (error) throw error;

      // Récupérer les détails de la réservation créée pour avoir le tracking_number
      const { data: bookingDetails, error: bookingError } = await supabase
        .from('bookings')
        .select('tracking_number')
        .eq('id', result)
        .single();

      if (bookingError) throw bookingError;

      // Invalider le cache des réservations pour forcer un rafraîchissement
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      
      return bookingDetails.tracking_number;
    } catch (error: any) {
      console.error("Error creating booking:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
}