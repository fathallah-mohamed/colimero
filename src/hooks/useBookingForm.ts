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
      console.log("Début de la création de la réservation", { tourId, formData });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Utilisateur non connecté");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation",
        });
        return { success: false };
      }

      // Appel de la fonction RPC pour créer la réservation
      const { data, error } = await supabase.rpc('create_booking_with_capacity_update', {
        p_tour_id: tourId,
        p_user_id: user.id,
        p_weight: formData.weight || 0,
        p_pickup_city: formData.pickup_city || '',
        p_delivery_city: formData.delivery_city || '',
        p_recipient_name: formData.recipient_name || '',
        p_recipient_address: formData.recipient_address || '',
        p_recipient_phone: formData.recipient_phone || '',
        p_sender_name: formData.sender_name || '',
        p_sender_phone: formData.sender_phone || '',
        p_item_type: formData.item_type || '',
        p_special_items: formData.special_items || [],
        p_content_types: formData.content_types || [],
        p_photos: formData.photos?.map(file => URL.createObjectURL(file)) || []
      });

      if (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        if (error.message.includes('Insufficient capacity')) {
          toast({
            variant: "destructive",
            title: "Capacité insuffisante",
            description: "La capacité restante de la tournée est insuffisante pour votre colis",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la création de la réservation",
          });
        }
        return { success: false };
      }

      console.log("Réservation créée avec succès", data);
      onSuccess?.();
      return { success: true };
      
    } catch (error: any) {
      console.error('Erreur inattendue:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur inattendue est survenue",
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