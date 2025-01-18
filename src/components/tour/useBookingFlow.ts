import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useBookingFlow() {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);

  const handleBookingClick = async (tourId: number, pickupCity: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const bookingPath = `/reserver/${tourId}?pickupCity=${encodeURIComponent(pickupCity)}`;
      sessionStorage.setItem('returnPath', bookingPath);
      navigate('/connexion');
      return;
    }

    // Check user type
    const userType = user.user_metadata?.user_type;
    
    if (userType === 'carrier') {
      setShowAccessDeniedDialog(true);
      return;
    }

    // Vérifier uniquement les réservations en attente
    const { data: pendingBookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
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

    if (pendingBookings) {
      toast({
        variant: "destructive",
        title: "Réservation impossible",
        description: "Vous avez déjà une réservation en attente. Veuillez attendre que votre réservation soit traitée avant d'en effectuer une nouvelle.",
      });
      return;
    }

    navigate(`/reserver/${tourId}?pickupCity=${encodeURIComponent(pickupCity)}`);
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    const returnPath = sessionStorage.getItem('returnPath');
    if (returnPath) {
      sessionStorage.removeItem('returnPath');
      navigate(returnPath);
    }
  };

  return {
    showAuthDialog,
    setShowAuthDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    handleBookingClick,
    handleAuthSuccess
  };
}