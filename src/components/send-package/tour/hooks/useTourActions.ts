import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tour } from "@/types/tour";

export function useTourActions(tour: Tour, selectedPickupCity: string | null, existingRequest: any) {
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkExistingBooking = async (userId: string) => {
    const { data: existingBooking, error } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('user_id', userId)
      .eq('tour_id', tour.id)
      .eq('status', 'cancelled')
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

    navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
  };

  const getActionButtonText = () => {
    if (!selectedPickupCity) return "Sélectionnez un point de collecte";
    return "Réserver maintenant";
  };

  const isActionEnabled = () => {
    return !!selectedPickupCity;
  };

  return {
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    handleActionClick,
    getActionButtonText,
    isActionEnabled
  };
}