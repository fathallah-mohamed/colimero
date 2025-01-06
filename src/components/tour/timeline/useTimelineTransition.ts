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

      let bookingStatus;
      switch (newStatus) {
        case 'preparation_completed':
          bookingStatus = 'pending';
          break;
        case 'collecting':
          bookingStatus = 'collecting';
          break;
        case 'collecting_completed':
          bookingStatus = 'collected';
          break;
        case 'in_transit':
          bookingStatus = 'in_transit';
          break;
        case 'transport_completed':
          bookingStatus = 'transport_completed';
          break;
        case 'delivery_in_progress':
          bookingStatus = 'delivering';
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
        'preparation_completed': 'La préparation est terminée',
        'collecting': 'Le ramassage est en cours',
        'collecting_completed': 'Le ramassage est terminé',
        'in_transit': 'La tournée est en transit',
        'transport_completed': 'Le transport est terminé',
        'delivery_in_progress': 'La livraison est en cours',
        'completed_completed': 'La tournée est terminée'
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