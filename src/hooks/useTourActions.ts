import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tour } from "@/types/tour";

export function useTourActions(tour: Tour, selectedPickupCity: string | null, existingRequest: any) {
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkExistingBookings = async (userId: string) => {
    // Vérifier les réservations en attente
    const { data: pendingBooking, error: pendingError } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('user_id', userId)
      .eq('tour_id', tour.id)
      .eq('status', 'pending')
      .maybeSingle();

    if (pendingError) {
      console.error('Error checking pending bookings:', pendingError);
      return { pendingBooking: null, cancelledBooking: null };
    }

    // Vérifier les réservations annulées
    const { data: cancelledBooking, error: cancelledError } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('user_id', userId)
      .eq('tour_id', tour.id)
      .eq('status', 'cancelled')
      .maybeSingle();

    if (cancelledError) {
      console.error('Error checking cancelled bookings:', cancelledError);
      return { pendingBooking, cancelledBooking: null };
    }

    return { pendingBooking, cancelledBooking };
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
      const returnPath = `/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`;
      sessionStorage.setItem('returnPath', returnPath);
      navigate('/connexion');
      return;
    }

    const userType = session.user.user_metadata?.user_type;
    if (userType === 'carrier') {
      setShowAccessDeniedDialog(true);
      return;
    }

    // Vérifier les réservations existantes
    const { pendingBooking, cancelledBooking } = await checkExistingBookings(session.user.id);

    // Si une réservation est en attente, bloquer l'accès
    if (pendingBooking) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous avez déjà une réservation en attente pour cette tournée. Veuillez attendre que votre réservation soit traitée avant d'en effectuer une nouvelle.",
      });
      return;
    }

    // Pour les tournées privées
    if (tour.type === 'private') {
      // Si une réservation a été annulée, forcer une nouvelle demande d'approbation
      if (cancelledBooking) {
        setShowApprovalDialog(true);
        return;
      }

      if (existingRequest) {
        switch (existingRequest.status) {
          case 'pending':
            toast({
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
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    showApprovalDialog,
    setShowApprovalDialog,
    handleActionClick,
    getActionButtonText,
    isActionEnabled
  };
}