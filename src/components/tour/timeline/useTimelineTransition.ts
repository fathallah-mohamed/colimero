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

      // Mise à jour du statut de la tournée
      const { error: tourError } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tourId);

      if (tourError) {
        console.error('Tour update error:', tourError);
        throw tourError;
      }

      // Mise à jour des réservations en fonction de la transition
      let bookingStatus;
      switch (newStatus) {
        case 'collecting':
          bookingStatus = 'pending';
          break;
        case 'in_transit':
          bookingStatus = 'collected';
          break;
        case 'completed_completed':
          bookingStatus = 'delivered';
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
      
      const statusMessages = {
        'collecting': 'La programmation est terminée',
        'in_transit': 'Le ramassage est terminé',
        'completed_completed': 'La livraison est terminée'
      };

      toast({
        title: "Statut mis à jour",
        description: statusMessages[newStatus as keyof typeof statusMessages] || "Le statut de la tournée a été mis à jour avec succès.",
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