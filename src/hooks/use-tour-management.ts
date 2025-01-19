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
      // If transitioning from "Ramassage en cours" to "En transit"
      if (newStatus === "En transit") {
        // Update all non-cancelled bookings to "collected" status
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

      // Update tour status
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