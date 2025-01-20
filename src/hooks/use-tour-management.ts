import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tour, TourStatus } from "@/types/tour";

const getNextStatus = (currentStatus: TourStatus): TourStatus => {
  switch (currentStatus) {
    case "Programmée":
      return "Ramassage en cours";
    case "Ramassage en cours":
      return "En transit";
    case "En transit":
      return "Livraison en cours";
    case "Livraison en cours":
      return "Terminée";
    default:
      return currentStatus;
  }
};

export function useTourManagement() {
  const navigate = useNavigate();
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (tourId: number) => {
    const tour = selectedTour;
    if (tour?.status === "Terminée") {
      toast({
        variant: "destructive",
        title: "Action impossible",
        description: "Les tournées terminées ne peuvent pas être supprimées",
      });
      return;
    }

    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', tourId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la tournée",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "La tournée a été supprimée",
    });
  };

  const handleEdit = (tour: Tour) => {
    if (tour.status === "Terminée") {
      toast({
        variant: "destructive",
        title: "Action impossible",
        description: "Les tournées terminées ne peuvent pas être modifiées",
      });
      return;
    }
    setSelectedTour(tour);
    setIsEditDialogOpen(true);
  };

  const handleStatusChange = async (tourId: number, newStatus: TourStatus) => {
    try {
      // Si on passe de "En transit" à "Livraison en cours"
      if (newStatus === "Livraison en cours") {
        // Vérifier que toutes les réservations sont dans un état valide
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('status')
          .eq('tour_id', tourId)
          .not('status', 'in', '(cancelled,reported,in_transit)');

        if (bookingsError) {
          console.error('Error checking bookings status:', bookingsError);
          throw bookingsError;
        }

        if (bookings && bookings.length > 0) {
          toast({
            variant: "destructive",
            title: "Action impossible",
            description: "Toutes les réservations doivent être annulées, signalées ou en transit avant de démarrer la livraison",
          });
          return;
        }
      }

      // Si on passe de "Ramassage en cours" à "En transit"
      if (newStatus === "En transit") {
        // Mettre à jour toutes les réservations non annulées en "collected"
        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ 
            status: 'collected',
            delivery_status: 'collected' 
          })
          .eq('tour_id', tourId)
          .neq('status', 'cancelled');

        if (bookingsError) {
          console.error('Error updating bookings status:', bookingsError);
          throw bookingsError;
        }
      }

      // Mettre à jour le statut de la tournée
      const { error: tourError } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tourId);

      if (tourError) throw tourError;

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la tournée a été mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating tour status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  const onEditComplete = () => {
    setIsEditDialogOpen(false);
    setSelectedTour(null);
  };

  return {
    selectedTour,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleDelete,
    handleEdit,
    handleStatusChange,
    onEditComplete,
  };
}