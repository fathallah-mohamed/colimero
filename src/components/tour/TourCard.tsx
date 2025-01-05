import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tour } from "@/types/tour";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import AuthDialog from "../auth/AuthDialog";

interface TourCardProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  isBookingEnabled: boolean;
  isPickupSelectionEnabled: boolean;
  bookingButtonText: string;
  onBookingClick: () => void;
}

export function TourCard({
  tour,
  selectedPickupCity,
  onPickupCitySelect,
  isBookingEnabled,
  isPickupSelectionEnabled,
  bookingButtonText,
  onBookingClick,
}: TourCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleBookingClick = () => {
    // Stocker le chemin de retour
    sessionStorage.setItem('returnPath', `/reserver/${tour.id}`);
    setShowAuthDialog(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    navigate(`/reserver/${tour.id}`);
  };

  // Calculate price based on carrier capacities
  const price = tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 0;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">Tournée #{tour.id}</h3>
        <p className="text-gray-600">
          {tour.departure_country} → {tour.destination_country}
        </p>
        <p className="text-gray-800 font-bold">{price} € / kg</p>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleBookingClick}
          disabled={!isBookingEnabled}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {bookingButtonText}
        </Button>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />
    </Card>
  );
}