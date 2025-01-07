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

      const bookingData: BookingFormData = {
        ...formData,
        user_id: user.id,
        tour_id: tourId,
        tracking_number: `TRK-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        content_types: formData.content_types || [],
        photos: formData.photos || []
      } as BookingFormData;

      // Start a transaction by using RPC
      const { data: result, error } = await supabase.rpc('create_booking_with_capacity_update', bookingData);

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