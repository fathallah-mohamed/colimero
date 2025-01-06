import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TourStatus } from "@/types/tour";

export function useTimelineTransition(tourId: number, onStatusChange: (newStatus: TourStatus) => void) {
  const { toast } = useToast();

  const handleStatusChange = async (currentStatus: TourStatus, newStatus: TourStatus) => {
    try {
      console.log('Starting status change process:', { tourId, currentStatus, newStatus });

      // Cas 1: De "collecting" à "planned"
      if (currentStatus === 'collecting' && newStatus === 'planned') {
        console.log('Case 1: collecting to planned');
        const { error: tourError } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (tourError) {
          console.error('Tour update error:', tourError);
          throw tourError;
        }

        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'pending' })
          .eq('tour_id', tourId)
          .eq('status', 'pending');

        if (bookingsError) {
          console.error('Bookings update error:', bookingsError);
          throw bookingsError;
        }

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée a été mis à jour. Les réservations collectées restent inchangées.",
        });
      }
      // Cas 2: De "collecting" à "in_transit"
      else if (currentStatus === 'collecting' && newStatus === 'in_transit') {
        console.log('Case 2: collecting to in_transit');
        const { error: tourError } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (tourError) {
          console.error('Tour update error:', tourError);
          throw tourError;
        }

        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'in_transit' })
          .eq('tour_id', tourId)
          .eq('status', 'collected');

        if (bookingsError) {
          console.error('Bookings update error:', bookingsError);
          throw bookingsError;
        }

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée et des réservations collectées ont été mis à jour avec succès.",
        });
      }
      // Cas 3: De "in_transit" à "collecting"
      else if (currentStatus === 'in_transit' && newStatus === 'collecting') {
        console.log('Case 3: in_transit to collecting');
        const { error: tourError } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (tourError) {
          console.error('Tour update error:', tourError);
          throw tourError;
        }

        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'collected' })
          .eq('tour_id', tourId)
          .eq('status', 'in_transit');

        if (bookingsError) {
          console.error('Bookings update error:', bookingsError);
          throw bookingsError;
        }

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée a été mis à jour. Les réservations en transit sont maintenant marquées comme collectées.",
        });
      }
      // Comportement normal pour les autres changements de statut
      else {
        console.log('Default case: simple status update');
        const { error } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (error) {
          console.error('Tour update error:', error);
          throw error;
        }

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée a été mis à jour avec succès.",
        });
      }
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