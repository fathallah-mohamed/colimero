import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useBookingSubmit(tourId: number, onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
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

      toast({
        title: "Réservation créée",
        description: "Votre réservation a été créée avec succès.",
      });

      // Invalider le cache des réservations pour forcer un rafraîchissement
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      
      if (onSuccess) {
        onSuccess();
      }
      
      navigate("/mes-reservations");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la réservation.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
}