import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Tour } from "@/types/tour";
import AuthDialog from "@/components/auth/AuthDialog";
import { EmailVerificationDialog } from "@/components/tour/EmailVerificationDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking/BookingForm";
import { TourCard } from "./TourCard";

type TransporteurToursProps = {
  tours: Tour[];
  type: "public" | "private";
  isLoading: boolean;
  hideAvatar?: boolean;
};

export function TransporteurTours({ tours, type, isLoading, hideAvatar }: TransporteurToursProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPoints, setSelectedPoints] = useState<Record<number, string>>({});
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
  const [currentTourId, setCurrentTourId] = useState<number | null>(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const handlePointSelection = (tourId: number, cityName: string) => {
    setSelectedPoints(prev => ({
      ...prev,
      [tourId]: cityName
    }));
  };

  const checkTourStatus = (tour: Tour) => {
    const nonBookableStatuses = ['collecting', 'in_transit', 'completed', 'cancelled'];
    if (nonBookableStatuses.includes(tour.status)) {
      toast({
        variant: "destructive",
        title: "Réservation impossible",
        description: "Cette tournée n'est plus au stade de ramassage. Les réservations ne sont plus possibles.",
      });
      return false;
    }
    return true;
  };

  const handleReservation = async (tourId: number) => {
    const currentTour = tours.find(t => t.id === tourId);
    if (!currentTour || !checkTourStatus(currentTour)) {
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const userType = session.user.user_metadata?.user_type;
      
      if (userType === 'carrier') {
        setShowAccessDenied(true);
        return;
      }

      setCurrentTourId(tourId);
      setIsBookingFormOpen(true);
      return;
    }

    setCurrentTourId(tourId);
    if (type === "private") {
      setIsEmailVerificationOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleEmailVerification = (email: string) => {
    toast({
      title: "Email vérifié",
      description: "Nous vous contacterons prochainement pour finaliser votre réservation.",
    });
    setIsEmailVerificationOpen(false);
  };

  const handleAuthSuccess = () => {
    const currentTour = tours.find(t => t.id === currentTourId);
    if (!currentTour || !checkTourStatus(currentTour)) {
      setIsAuthOpen(false);
      return;
    }
    setIsAuthOpen(false);
    setIsBookingFormOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingFormOpen(false);
    navigate("/mes-reservations");
  };

  const handleStatusChange = (tourId: number) => (newStatus: string) => {
    setSelectedPoints(prev => ({
      ...prev,
      [tourId]: prev[tourId]
    }));
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

  if (tours.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Aucune tournée {type === "public" ? "publique" : "privée"} disponible
      </div>
    );
  }

  const currentTour = currentTourId ? tours.find(tour => tour.id === currentTourId) : null;

  return (
    <div className="space-y-4">
      <AccessDeniedMessage 
        userType="carrier" 
        isOpen={showAccessDenied} 
        onClose={() => setShowAccessDenied(false)}
      />

      {tours.map((tour) => (
        <TourCard
          key={tour.id}
          tour={tour}
          selectedPoint={selectedPoints[tour.id]}
          onPointSelect={(cityName) => handlePointSelection(tour.id, cityName)}
          onReservation={() => handleReservation(tour.id)}
          hideAvatar={hideAvatar}
          onStatusChange={handleStatusChange(tour.id)}
        />
      ))}

      <AuthDialog 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />

      <EmailVerificationDialog
        isOpen={isEmailVerificationOpen}
        onClose={() => setIsEmailVerificationOpen(false)}
        onVerify={handleEmailVerification}
      />

      <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
        <DialogContent className="sm:max-w-[500px] h-[90vh]">
          {currentTourId && selectedPoints[currentTourId] && currentTour && (
            <BookingForm
              tourId={currentTourId}
              pickupCity={selectedPoints[currentTourId]}
              destinationCountry={currentTour.destination_country}
              onSuccess={handleBookingSuccess}
              onCancel={() => setIsBookingFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
