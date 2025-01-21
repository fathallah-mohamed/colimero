import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tour } from "@/types/tour";

export function useTourActions(tour: Tour, selectedPickupCity: string | null, existingRequest: any) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkExistingBooking = async (userId: string) => {
    const { data: existingBooking, error } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('user_id', userId)
      .eq('tour_id', tour.id)
      .eq('status', 'pending')
      .maybeSingle();

    if (error) {
      console.error('Error checking existing bookings:', error);
      return null;
    }

    return existingBooking;
  };

  const handleActionClick = async () => {
    if (!selectedPickupCity) {
      toast({
        variant: "destructive",
        title: "Point de collecte requis",
        description: "Veuillez sélectionner un point de collecte",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    const userType = session.user.user_metadata?.user_type;
    if (userType === 'carrier') {
      setShowAccessDeniedDialog(true);
      return;
    }

    // Pour les tournées privées
    if (tour.type === 'private') {
      // Vérifier s'il y a une réservation en attente
      const existingBooking = await checkExistingBooking(session.user.id);
      if (existingBooking) {
        toast({
          variant: "destructive",
          title: "Réservation impossible",
          description: "Vous avez déjà une réservation en attente pour cette tournée",
        });
        return;
      }

      if (existingRequest) {
        switch (existingRequest.status) {
          case 'pending':
            toast({
              variant: "destructive",
              title: "Demande en attente",
              description: "Votre demande d'approbation est en cours de traitement",
            });
            return;
          case 'approved':
            navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
            return;
          case 'rejected':
            toast({
              variant: "destructive",
              title: "Demande rejetée",
              description: "Votre demande d'approbation a été rejetée pour cette tournée",
            });
            return;
          default:
            setShowApprovalDialog(true);
            return;
        }
      } else {
        setShowApprovalDialog(true);
      }
    } else {
      // Pour les tournées publiques
      const existingBooking = await checkExistingBooking(session.user.id);
      if (existingBooking) {
        toast({
          variant: "destructive",
          title: "Réservation impossible",
          description: "Vous avez déjà une réservation en attente pour cette tournée",
        });
        return;
      }
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
    }
  };

  const getActionButtonText = () => {
    if (!selectedPickupCity) return "Sélectionnez un point de collecte";
    
    if (tour.type === 'private') {
      if (existingRequest) {
        switch (existingRequest.status) {
          case 'pending':
            return "Demande en attente d'approbation";
          case 'approved':
            return "Réserver maintenant";
          case 'rejected':
            return "Demande rejetée";
          default:
            return "Demander l'approbation";
        }
      }
      return "Demander l'approbation";
    }
    return "Réserver maintenant";
  };

  const isActionEnabled = () => {
    if (!selectedPickupCity) return false;
    if (tour.type === 'private') {
      if (existingRequest) {
        return existingRequest.status === 'approved';
      }
      return true;
    }
    return true;
  };

  return {
    showAuthDialog,
    setShowAuthDialog,
    showApprovalDialog,
    setShowApprovalDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    handleActionClick,
    getActionButtonText,
    isActionEnabled
  };
}