import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TourStatus } from "@/types/tour";

export function useTimelineTransition(tourId: number, onStatusChange: (newStatus: TourStatus) => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (currentStatus: TourStatus, newStatus: TourStatus) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      console.log(`Attempting to update tour ${tourId} status from ${currentStatus} to ${newStatus}`);

      const { error } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tourId);

      if (error) {
        console.error('Error updating tour status:', error);
        throw error;
      }

      // Si la mise à jour dans la BDD réussit, on met à jour l'état local
      onStatusChange(newStatus);
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la tournée a été mis à jour avec succès.",
      });

      // Mise à jour des réservations si nécessaire
      if (currentStatus === 'collecting' && newStatus === 'in_transit') {
        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'in_transit' })
          .eq('tour_id', tourId)
          .eq('status', 'collected');

        if (bookingsError) {
          console.error('Error updating bookings status:', bookingsError);
        }
      }

    } catch (error: any) {
      console.error('Error in handleStatusChange:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tournée.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return { handleStatusChange, isUpdating };
}