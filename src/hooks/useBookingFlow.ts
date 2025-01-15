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
      setShowAuthDialog(true);
      return;
    }

    // Vérifier le type d'utilisateur
    const userType = user.user_metadata?.user_type;
    
    if (userType === 'carrier') {
      setShowAccessDeniedDialog(true);
      return;
    }

    // Vérifier si l'utilisateur a déjà une réservation en cours
    const { data: existingBookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['pending', 'confirmed', 'in_transit'])
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

    if (existingBookings) {
      toast({
        variant: "destructive",
        title: "Réservation impossible",
        description: "Vous avez déjà une réservation en cours. Veuillez attendre que votre colis soit livré avant d'effectuer une nouvelle réservation.",
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