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

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("bookings").insert({
        ...data,
        tour_id: tourId,
        user_id: user.id,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Réservation créée",
        description: "Votre réservation a été créée avec succès",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error.message || "Une erreur est survenue lors de la création de la réservation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading,
  };
}