import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { BookingStatus } from "@/types/booking";

export function useBookingStatus(
  bookingId: string,
  initialStatus: BookingStatus,
  onSuccess: (bookingId: string, newStatus: BookingStatus) => void,
  onUpdate: () => Promise<void>
) {
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateStatus = async (newStatus: BookingStatus) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      console.log("Updating booking status to:", newStatus, "for booking:", bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Vérifier que la mise à jour a bien été effectuée
      const { data: updatedBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('status, delivery_status')
        .eq('id', bookingId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (updatedBooking?.status === newStatus) {
        setCurrentStatus(newStatus);
        onSuccess(bookingId, newStatus);
        
        toast({
          title: "Succès",
          description: "Le statut a été mis à jour",
        });
      } else {
        throw new Error("La mise à jour n'a pas été enregistrée");
      }
    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
      // Recharger le statut actuel depuis la base de données
      await onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    currentStatus,
    isUpdating,
    updateStatus
  };
}