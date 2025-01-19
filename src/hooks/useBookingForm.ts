import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BookingFormData } from "@/types/booking";

export function useBookingForm(tourId: number, onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);

  const createBooking = async (formData: Partial<BookingFormData>) => {
    try {
      setIsLoading(true);
      console.log("Début de la création de la réservation", { tourId, formData });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Utilisateur non connecté");
        return { 
          success: false, 
          message: "Vous devez être connecté pour effectuer une réservation" 
        };
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
        // Gérer spécifiquement l'erreur de capacité insuffisante
        if (error.message.includes('Insufficient capacity')) {
          return { 
            success: false, 
            message: "La capacité restante de la tournée est insuffisante pour votre colis" 
          };
        }
        return { 
          success: false, 
          message: error.message || "Une erreur est survenue lors de la création de la réservation" 
        };
      }

      console.log("Réservation créée avec succès", data);
      onSuccess?.();
      return { success: true, message: "Réservation créée avec succès" };
      
    } catch (error: any) {
      console.error('Erreur inattendue:', error);
      return { 
        success: false, 
        message: error.message || "Une erreur inattendue est survenue" 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading,
  };
}