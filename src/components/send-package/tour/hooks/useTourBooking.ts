import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tour } from "@/types/tour";

export function useTourBooking(tour: Tour) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [showPendingApprovalDialog, setShowPendingApprovalDialog] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkExistingRequest();
  }, [tour.id]);

  const checkExistingRequest = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: request, error } = await supabase
      .from('approval_requests')
      .select('*')
      .eq('tour_id', tour.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking existing request:', error);
      return;
    }

    setExistingRequest(request);
  };

  const handleBookingClick = async (selectedPoint: string) => {
    if (!selectedPoint) {
      toast({
        variant: "destructive",
        title: "Point de collecte requis",
        description: "Veuillez sélectionner un point de collecte",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      const returnPath = `/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`;
      sessionStorage.setItem('returnPath', returnPath);
      setShowAuthDialog(true);
      return;
    }

    const userType = session.user.user_metadata?.user_type;
    if (userType === 'carrier') {
      setShowAccessDeniedDialog(true);
      return;
    }

    if (tour.type === 'private') {
      if (existingRequest) {
        switch (existingRequest.status) {
          case 'pending':
            setShowPendingApprovalDialog(true);
            return;
          case 'approved':
            navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`);
            return;
          case 'rejected':
            toast({
              variant: "destructive",
              title: "Demande rejetée",
              description: "Votre demande d'approbation a été rejetée pour cette tournée",
            });
            return;
        }
      }
      setShowApprovalDialog(true);
    } else {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`);
    }
  };

  const getActionButtonText = () => {
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
    showPendingApprovalDialog,
    setShowPendingApprovalDialog,
    existingRequest,
    handleBookingClick,
    getActionButtonText,
    isActionEnabled
  };
}