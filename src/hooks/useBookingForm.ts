import { useState } from "react";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { BookingFormData } from "@/types/booking";

export function useBookingForm(tourId: number, onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createBooking = async (data: BookingFormData) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation",
        });
        return { success: false };
      }

      // Start a transaction by using RPC
      const { data: result, error } = await supabase.rpc('create_booking_with_capacity_update', {
        p_tour_id: tourId,
        p_user_id: user.id,
        p_weight: data.weight,
        p_pickup_city: data.pickup_city,
        p_delivery_city: data.deliveryCity,
        p_recipient_name: data.recipientName,
        p_recipient_address: data.recipientAddress,
        p_recipient_phone: data.recipientPhone,
        p_sender_name: data.senderName,
        p_sender_phone: data.senderPhone,
        p_item_type: data.item_type,
        p_special_items: data.special_items,
        p_content_types: data.content_types,
        p_photos: data.photos
      });

      if (error) throw error;

      toast({
        title: "Réservation créée",
        description: "Votre réservation a été créée avec succès",
      });

      onSuccess?.();
      return { success: true };
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la réservation",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading,
  };
}