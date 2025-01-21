import { useState } from "react";
import { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourRoute } from "./components/TourRoute";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { TourDialogs } from "./components/TourDialogs";
import { useApprovalRequest } from "./hooks/useApprovalRequest";
import { useTourActions } from "./hooks/useTourActions";
import { CardCustom } from "@/components/ui/card-custom";
import { useNavigate } from "react-router-dom";
import { BookingErrorDialog } from "@/components/booking/form/BookingErrorDialog";
import { supabase } from "@/integrations/supabase/client";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const navigate = useNavigate();
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBookingError, setShowBookingError] = useState(false);
  const [bookingErrorMessage, setBookingErrorMessage] = useState("");
  
  const { existingRequest, checkExistingRequest } = useApprovalRequest(tour.id);
  
  const {
    showAuthDialog,
    setShowAuthDialog,
    showApprovalDialog,
    setShowApprovalDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    handleActionClick,
    getActionButtonText,
    isActionEnabled
  } = useTourActions(tour, selectedPickupCity, existingRequest);

  const handleApprovalSuccess = () => {
    setShowApprovalDialog(false);
    checkExistingRequest();
  };

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

  const handleBookingClick = async () => {
    if (!selectedPickupCity) return;

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

    // Vérifier s'il existe une réservation en attente
    const existingBooking = await checkExistingBooking(session.user.id);
    if (existingBooking) {
      setBookingErrorMessage("Vous avez déjà une réservation en attente pour cette tournée.");
      setShowBookingError(true);
      return;
    }

    navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
  };

  return (
    <CardCustom className="bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md">
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <TourMainInfo tour={tour} />
          
          <TourRoute 
            stops={tour.route} 
            onPointSelect={setSelectedPickupCity}
            selectedPoint={selectedPickupCity}
          />

          {isExpanded && (
            <TourExpandedContent 
              tour={tour}
              selectedPickupCity={selectedPickupCity}
              onPickupCitySelect={setSelectedPickupCity}
              onActionClick={handleBookingClick}
              isActionEnabled={isActionEnabled()}
              actionButtonText={getActionButtonText()}
              hasPendingRequest={existingRequest?.status === 'pending'}
            />
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full text-[#0FA0CE] hover:text-[#0FA0CE] hover:bg-[#0FA0CE]/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isExpanded ? "Masquer les détails" : "Afficher les détails"}
          </Button>
        </div>
      </div>

      <TourDialogs
        showAccessDeniedDialog={showAccessDeniedDialog}
        setShowAccessDeniedDialog={setShowAccessDeniedDialog}
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        showApprovalDialog={showApprovalDialog}
        setShowApprovalDialog={setShowApprovalDialog}
        tourId={tour.id}
        pickupCity={selectedPickupCity || ''}
        onApprovalSuccess={handleApprovalSuccess}
      />

      <BookingErrorDialog
        open={showBookingError}
        onClose={() => setShowBookingError(false)}
        errorMessage={bookingErrorMessage}
      />
    </CardCustom>
  );
}