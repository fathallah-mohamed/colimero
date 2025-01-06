import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tour, TourStatus } from "@/types/tour";

const getCompletedStatus = (currentStatus: TourStatus): TourStatus => {
  switch (currentStatus) {
    case 'planned':
      return 'planned_completed';
    case 'collecting':
      return 'collecting_completed';
    case 'in_transit':
      return 'in_transit_completed';
    case 'completed':
      return 'completed_completed';
    default:
      return currentStatus;
  }
};

const getNextStatus = (currentStatus: TourStatus): TourStatus => {
  switch (currentStatus) {
    case 'planned':
      return 'collecting';
    case 'collecting':
      return 'in_transit';
    case 'in_transit':
      return 'completed';
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
    if (tour?.status === 'completed_completed') {
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
    if (tour.status === 'completed_completed') {
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
      // Si on passe à un nouveau statut, mettre à jour l'ancien statut comme terminé
      if (selectedTour?.status) {
        const completedStatus = getCompletedStatus(selectedTour.status);
        await supabase
          .from('tours')
          .update({ status: completedStatus })
          .eq('id', tourId);
      }

      // Mettre à jour avec le nouveau statut
      const { error } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tourId);

      if (error) throw error;

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