import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tour } from "@/types/tour";

export function useTourBooking(tour: Tour) {
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [showExistingBookingDialog, setShowExistingBookingDialog] = useState(false);
  const [showPendingApprovalDialog, setShowPendingApprovalDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkExistingApprovalRequest = async (userId: string) => {
    const { data: approvalRequest, error } = await supabase
      .from('approval_requests')
      .select('status')
      .eq('tour_id', tour.id)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .maybeSingle();

    if (error) {
      console.error('Error checking approval request:', error);
      return false;
    }

    return approvalRequest !== null;
  };

  const handleBookingButtonClick = async (selectedPoint: string) => {
    if (!selectedPoint) {
      toast({
        variant: "destructive",
        title: "Point de collecte requis",
        description: "Veuillez sélectionner un point de collecte avant de réserver",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const bookingPath = `/envoyer-colis`;
        sessionStorage.setItem('returnPath', bookingPath);
        navigate('/connexion');
        return;
      }

      const userType = session.user.user_metadata?.user_type;
      
      if (userType === 'carrier') {
        setShowAccessDeniedDialog(true);
        return;
      }

      if (tour.type === 'private') {
        const hasPendingRequest = await checkExistingApprovalRequest(session.user.id);
        if (hasPendingRequest) {
          setShowPendingApprovalDialog(true);
          return;
        }
      }

      const { data: pendingBooking, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('tour_id', tour.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (error) {
        console.error('Error checking existing bookings:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de vos réservations",
        });
        return;
      }

      if (pendingBooking) {
        setShowExistingBookingDialog(true);
        return;
      }

      if (tour.type === 'private') {
        setShowApprovalDialog(true);
      } else {
        navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`);
      }
    } catch (error) {
      console.error("Error in handleBookingButtonClick:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
      });
    }
  };

  return {
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    showExistingBookingDialog,
    setShowExistingBookingDialog,
    showPendingApprovalDialog,
    setShowPendingApprovalDialog,
    showApprovalDialog,
    setShowApprovalDialog,
    handleBookingButtonClick,
  };
}