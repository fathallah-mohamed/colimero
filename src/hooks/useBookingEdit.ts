import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookingFormData {
  sender_name: string;
  sender_phone: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  delivery_city: string;
  weight: number;
  content_types: string[];
  special_items: string[];
  photos: string[];
}

export function useBookingEdit(bookingId: string, onSuccess: () => Promise<void>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateBooking = async (formData: BookingFormData, itemQuantities: Record<string, number>) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting updated booking data:", formData);
      console.log("Item quantities:", itemQuantities);

      // Format special items to include quantities
      const formattedSpecialItems = formData.special_items.map(item => ({
        name: item,
        quantity: itemQuantities[item] || 1
      }));

      console.log("Formatted special items:", formattedSpecialItems);

      const { error } = await supabase
        .from("bookings")
        .update({
          sender_name: formData.sender_name,
          sender_phone: formData.sender_phone,
          recipient_name: formData.recipient_name,
          recipient_phone: formData.recipient_phone,
          recipient_address: formData.recipient_address,
          delivery_city: formData.delivery_city,
          weight: formData.weight,
          content_types: formData.content_types,
          special_items: formattedSpecialItems,
          photos: formData.photos
        })
        .eq("id", bookingId);

      if (error) {
        console.error("Error updating booking:", error);
        throw error;
      }

      toast({
        title: "Succès",
        description: "La réservation a été mise à jour",
      });

      await onSuccess();
      return true;
    } catch (error: any) {
      console.error("Error in updateBooking:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la réservation",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    updateBooking
  };
}