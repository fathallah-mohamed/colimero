import { useState } from "react";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { BookingFormData } from "@/types/booking";

export function useBookingForm(tourId: number, onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createBooking = async (formData: Partial<BookingFormData>) => {
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

      // Récupérer les informations de la tournée pour le tracking number
      const { data: tourData } = await supabase
        .from('tours')
        .select('departure_country, destination_country')
        .eq('id', tourId)
        .single();

      if (!tourData) {
        throw new Error("Impossible de récupérer les informations de la tournée");
      }

      // Start a transaction by using RPC
      const { data: result, error } = await supabase.rpc('create_booking_with_capacity_update', {
        p_tour_id: tourId,
        p_user_id: user.id,
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
        p_content_types: formData.content_types || [],
        p_photos: formData.photos?.map(file => URL.createObjectURL(file)) || []
      });

      if (error) {
        // Gérer l'erreur de contrainte unique
        if (error.message?.includes('unique_user_tour')) {
          toast({
            variant: "destructive",
            title: "Réservation impossible",
            description: "Vous avez déjà une réservation pour cette tournée",
          });
          return { success: false };
        }
        throw error;
      }

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