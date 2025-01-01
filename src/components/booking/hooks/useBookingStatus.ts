import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { BookingStatus } from "@/types/booking";

export function useBookingStatus(
  bookingId: string,
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void,
  onUpdate: () => Promise<void>
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateStatus = async (newStatus: BookingStatus) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      console.log("Updating booking status to:", newStatus, "for booking:", bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Error in updateBookingStatus:', error);
        throw error;
      }

      await onStatusChange(bookingId, newStatus);
      
      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });

      await onUpdate();

    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    updateStatus
  };
}