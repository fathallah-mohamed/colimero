import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TourStatus } from "@/types/tour";
import { useQueryClient } from "@tanstack/react-query";

export function useTimelineTransition(tourId: number, onStatusChange: (newStatus: TourStatus) => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusChange = async (currentStatus: TourStatus, newStatus: TourStatus) => {
    try {
      console.log('Starting status change process:', { tourId, currentStatus, newStatus });

      const { error: tourError } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tourId);

      if (tourError) {
        console.error('Tour update error:', tourError);
        throw tourError;
      }

      let bookingStatus: string;
      switch (newStatus) {
        case "Programmée":
          bookingStatus = 'pending';
          break;
        case "Ramassage en cours":
          bookingStatus = 'collecting';
          break;
        case "En transit":
          bookingStatus = 'in_transit';
          break;
        case "Terminée":
          bookingStatus = 'delivered';
          break;
        case "Annulée":
          bookingStatus = 'cancelled';
          break;
        default:
          bookingStatus = 'pending';
      }

      const { error: bookingsError } = await supabase
        .from('bookings')
        .update({ status: bookingStatus })
        .eq('tour_id', tourId);

      if (bookingsError) {
        console.error('Bookings update error:', bookingsError);
        throw bookingsError;
      }

      onStatusChange(newStatus);
      await queryClient.invalidateQueries({ queryKey: ['tours'] });

      toast({
        title: "Statut mis à jour",
        description: `La tournée est maintenant en statut "${newStatus}"`,
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tournée.",
      });
    }
  };

  return { handleStatusChange };
}