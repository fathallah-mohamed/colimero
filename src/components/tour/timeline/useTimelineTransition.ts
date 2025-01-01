import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TourStatus } from "@/types/tour";

export function useTimelineTransition(tourId: number, onStatusChange: (newStatus: TourStatus) => void) {
  const { toast } = useToast();

  const handleStatusChange = async (currentStatus: TourStatus, newStatus: TourStatus) => {
    try {
      // Cas 1: De "collecting" à "planned"
      if (currentStatus === 'collecting' && newStatus === 'planned') {
        const { error: tourError } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (tourError) throw tourError;

        // Les réservations avec statut "collected" restent "collected"
        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'pending' })
          .eq('tour_id', tourId)
          .eq('status', 'pending');

        if (bookingsError) throw bookingsError;

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée a été mis à jour. Les réservations collectées restent inchangées.",
        });
      }
      // Cas 2: De "collecting" à "in_transit"
      else if (currentStatus === 'collecting' && newStatus === 'in_transit') {
        const { error: tourError } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (tourError) throw tourError;

        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'in_transit' })
          .eq('tour_id', tourId)
          .eq('status', 'collected');

        if (bookingsError) throw bookingsError;

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée et des réservations collectées ont été mis à jour avec succès.",
        });
      }
      // Cas 3: De "in_transit" à "collecting"
      else if (currentStatus === 'in_transit' && newStatus === 'collecting') {
        const { error: tourError } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (tourError) throw tourError;

        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'collected' })
          .eq('tour_id', tourId)
          .eq('status', 'in_transit');

        if (bookingsError) throw bookingsError;

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée a été mis à jour. Les réservations en transit sont maintenant marquées comme collectées.",
        });
      }
      // Comportement normal pour les autres changements de statut
      else {
        const { error } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (error) throw error;

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée a été mis à jour avec succès.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tournée.",
      });
    }
  };

  return { handleStatusChange };
}