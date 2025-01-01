import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useBookingEdit(bookingId: string, onSuccess: () => Promise<void>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateBooking = async (formData: any, itemQuantities: Record<string, number>) => {
    try {
      setIsSubmitting(true);
      console.log("Starting booking update with ID:", bookingId);
      console.log("Form data:", formData);
      console.log("Item quantities:", itemQuantities);

      // Format special items with quantities
      const formattedSpecialItems = formData.special_items.map((item: string) => ({
        name: item,
        quantity: itemQuantities[item] || 1
      }));

      console.log("Formatted special items:", formattedSpecialItems);

      // Prepare update data
      const updateData = {
        sender_name: formData.sender_name,
        sender_phone: formData.sender_phone,
        recipient_name: formData.recipient_name,
        recipient_phone: formData.recipient_phone,
        recipient_address: formData.recipient_address,
        delivery_city: formData.delivery_city,
        weight: formData.weight,
        content_types: formData.content_types,
        special_items: formattedSpecialItems,
      };

      console.log("Final update data:", updateData);

      const { data, error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId)
        .select();

      if (error) {
        console.error("Error updating booking:", error);
        throw error;
      }

      console.log("Update successful, response:", data);

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