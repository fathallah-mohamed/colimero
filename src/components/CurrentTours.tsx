import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AuthDialog from "@/components/auth/AuthDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { TourTimelineCard } from "@/components/transporteur/tour/TourTimelineCard";
import { NextTourSection } from "@/components/tour/NextTourSection";
import { useNextTour } from "@/components/tour/useNextTour";
import { useBookingFlow } from "@/components/tour/useBookingFlow";

export default function CurrentTours() {
  const navigate = useNavigate();
  const { data: nextTour, isLoading } = useNextTour();
  const {
    showAuthDialog,
    setShowAuthDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    handleBookingClick,
    handleAuthSuccess
  } = useBookingFlow();

  return (
    <div className="py-8 px-4">
      <NextTourSection isLoading={isLoading} nextTour={nextTour} />

      {nextTour && (
        <TourTimelineCard 
          tour={nextTour}
          onBookingClick={handleBookingClick}
          hideAvatar={false}
        />
      )}

      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate('/envoyer-colis')}
          variant="outline"
          className="gap-2"
        >
          Découvrir toutes nos tournées
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />

      <AccessDeniedMessage
        userType="carrier"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />
    </div>
  );
}