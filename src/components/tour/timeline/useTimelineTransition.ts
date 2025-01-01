import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TourStatus } from "@/types/tour";

export function useTimelineTransition(tourId: number, onStatusChange: (newStatus: TourStatus) => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (currentStatus: TourStatus, newStatus: TourStatus) => {
    if (isUpdating) return;

    // Validate status transition
    const validTransitions: Record<TourStatus, TourStatus[]> = {
      'planned': ['collecting'],
      'collecting': ['in_transit', 'planned'],
      'in_transit': ['completed'],
      'completed': [],
      'cancelled': []
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      toast({
        variant: "destructive",
        title: "Transition invalide",
        description: "Cette transition de statut n'est pas autorisée.",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const { error: updateError } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tourId);

      if (updateError) throw updateError;

      // Update bookings status based on tour status transition
      if (newStatus === 'in_transit') {
        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'in_transit' })
          .eq('tour_id', tourId)
          .eq('status', 'collected');

        if (bookingsError) throw bookingsError;
      }

      onStatusChange(newStatus);
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la tournée a été mis à jour avec succès.",
      });
    } catch (error: any) {
      console.error('Error updating tour status:', error);
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