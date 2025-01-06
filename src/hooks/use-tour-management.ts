import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tour, TourStatus } from "@/types/tour";

const getCompletedStatus = (currentStatus: TourStatus, newStatus: TourStatus): TourStatus | null => {
  // Si on passe à "collecting" (ramassage en cours), "planned" devient "planned_completed"
  if (newStatus === 'collecting' && currentStatus === 'planned') {
    return 'planned_completed';
  }
  
  // Si on passe à "in_transit", "collecting" devient "collecting_completed"
  if (newStatus === 'in_transit' && currentStatus === 'collecting') {
    return 'collecting_completed';
  }
  
  // Si on passe à "completed" (livraison), "in_transit" devient "in_transit_completed"
  if (newStatus === 'completed' && currentStatus === 'in_transit') {
    return 'in_transit_completed';
  }
  
  // Si on termine la livraison
  if (newStatus === 'completed_completed' && currentStatus === 'completed') {
    return 'completed_completed';
  }

  return null;
};

const getNextStatus = (currentStatus: TourStatus): TourStatus => {
  switch (currentStatus) {
    case 'planned':
      return 'collecting';
    case 'collecting':
      return 'in_transit';
    case 'in_transit':
      return 'completed';
    case 'completed':
      return 'completed_completed';
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
      // Récupérer le statut actuel de la tournée
      const { data: tourData, error: tourError } = await supabase
        .from('tours')
        .select('status')
        .eq('id', tourId)
        .single();

      if (tourError) throw tourError;

      const currentStatus = tourData.status as TourStatus;
      
      // Vérifier si un statut précédent doit être marqué comme terminé
      const completedStatus = getCompletedStatus(currentStatus, newStatus);
      
      if (completedStatus) {
        // Mettre à jour l'ancien statut comme terminé
        const { error: updateError } = await supabase
          .from('tours')
          .update({ status: completedStatus })
          .eq('id', tourId);

        if (updateError) throw updateError;
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