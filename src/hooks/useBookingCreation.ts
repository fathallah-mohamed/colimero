import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BookingFormData } from "@/types/booking";

export function useBookingCreation(tourId: number, onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const createBooking = async (formData: BookingFormData) => {
    try {
      setIsLoading(true);
      console.log('Starting booking creation process...');

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error("Erreur de session. Veuillez vous reconnecter.");
      }

      if (!session) {
        console.log('No active session found');
        navigate('/connexion');
        return;
      }

      console.log('Preparing booking data for submission:', formData);

      const specialItemsData = formData.special_items?.map(item => ({
        name: item,
        quantity: formData.itemQuantities?.[item] || 1
      })) || [];

      const { data, error } = await supabase.rpc(
        'create_booking_with_capacity_update',
        {
          p_tour_id: tourId,
          p_user_id: session.user.id,
          p_weight: formData.weight || 5,
          p_pickup_city: formData.pickup_city || "",
          p_delivery_city: formData.delivery_city || "",
          p_recipient_name: formData.recipient_name,
          p_recipient_address: formData.recipient_address,
          p_recipient_phone: formData.recipient_phone,
          p_sender_name: formData.sender_name,
          p_sender_phone: formData.sender_phone,
          p_item_type: formData.item_type || "standard",
          p_special_items: specialItemsData,
          p_content_types: formData.content_types || [],
          p_photos: formData.photos || []
        }
      );

      if (error) {
        console.error('Booking creation error:', error);
        throw error;
      }

      console.log('Booking created successfully:', data);
      toast({
        title: "Réservation créée",
        description: "Votre réservation a été créée avec succès.",
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/mes-reservations');
      }

      return data;
    } catch (error: any) {
      console.error("Error in createBooking:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la réservation.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading
  };
}