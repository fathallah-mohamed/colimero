import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useBookingSubmit(tourId: number) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Vous devez être connecté pour effectuer une réservation");
      }

      const { data: result, error } = await supabase.rpc(
        'create_booking_with_capacity_update',
        {
          p_tour_id: tourId,
          p_user_id: session.user.id,
          p_weight: formData.weight,
          p_pickup_city: formData.pickup_city,
          p_delivery_city: formData.delivery_city,
          p_recipient_name: formData.recipient_name,
          p_recipient_address: formData.recipient_address,
          p_recipient_phone: formData.recipient_phone,
          p_sender_name: formData.sender_name,
          p_sender_phone: formData.sender_phone,
          p_item_type: formData.item_type,
          p_special_items: formData.special_items,
          p_content_types: formData.content_types,
          p_photos: formData.photos || []
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

  const handleComplete = () => {
    navigate('/mes-reservations');
  };

  return {
    isLoading,
    handleSubmit,
    handleComplete
  };
}