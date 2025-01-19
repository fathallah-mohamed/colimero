import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBookingForm } from "@/hooks/useBookingForm";
import { BookingFormData } from "@/types/booking";
import { z } from "zod";
import { formSchema } from "./schema";

export function useBookingSubmit(
  tourId: number,
  onSuccess: () => void,
  setTrackingNumber: (number: string) => void,
  setShowConfirmDialog: (show: boolean) => void,
  setErrorMessage: (message: string) => void,
  setShowErrorDialog: (show: boolean) => void
) {
  const { createBooking, isLoading } = useBookingForm(tourId, onSuccess);

  const handleSubmit = async (
    values: z.infer<typeof formSchema>,
    formData: Partial<BookingFormData>
  ) => {
    try {
      if (!values.sender_name || !values.sender_phone) {
        throw new Error("Les informations de l'expéditeur sont requises");
      }

      const bookingId = await createBooking(formData as BookingFormData);
      
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('tracking_number')
        .eq('id', bookingId)
        .single();

      if (bookingError) {
        throw bookingError;
      }

      setTrackingNumber(bookingData.tracking_number);
      setShowConfirmDialog(true);
      
    } catch (error: any) {
      console.error("Erreur lors de la création de la réservation:", error);
      setErrorMessage(error?.message || "Une erreur est survenue lors de la création de la réservation");
      setShowErrorDialog(true);
    }
  };

  return {
    handleSubmit,
    isLoading
  };
}