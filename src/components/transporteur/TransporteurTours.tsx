import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Tour } from "@/types/tour";
import AuthDialog from "@/components/auth/AuthDialog";
import { EmailVerificationDialog } from "@/components/tour/EmailVerificationDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking/BookingForm";
import { TourCard } from "./TourCard";

type TransporteurToursProps = {
  tours: Tour[];
  type: "public" | "private";
  isLoading: boolean;
  hideAvatar?: boolean;
};

export function TransporteurTours({ tours, type, isLoading }: TransporteurToursProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
  const [currentTourId, setCurrentTourId] = useState<number | null>(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const handleEmailVerification = (email: string) => {
    toast({
      title: "Email vérifié",
      description: "Nous vous contacterons prochainement pour finaliser votre réservation.",
    });
    setIsEmailVerificationOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    setIsBookingFormOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingFormOpen(false);
    navigate("/mes-reservations");
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
        <DialogContent className="sm:max-w-[500px]">
          {currentTourId && (
            <BookingForm
              tourId={currentTourId}
              pickupCity={tours.find(t => t.id === currentTourId)?.route[0].name || ''}
              destinationCountry={tours.find(t => t.id === currentTourId)?.destination_country || ''}
              onSuccess={handleBookingSuccess}
              onCancel={() => setIsBookingFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}