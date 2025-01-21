import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tour } from "@/types/tour";

export function useBookingButton(tour: Tour) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActionEnabled = (selectedPickupCity: string | null, existingRequest?: any) => {
    if (!selectedPickupCity) return false;
    if (tour.status !== "Programmée") return false;
    
    if (tour.type === 'private' && existingRequest) {
      return existingRequest.status === 'approved';
    }
    
    return true;
  };

  const handleBookingClick = async (selectedPickupCity: string) => {
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

    if (tour.type === 'private') {
      setShowApprovalDialog(true);
    } else {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
    }
  };

  return {
    showAuthDialog,
    setShowAuthDialog,
    showApprovalDialog,
    setShowApprovalDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    isActionEnabled,
    handleBookingClick
  };
}