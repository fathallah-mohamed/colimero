import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TourTimeline } from "@/components/transporteur/TourTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { TransporteurAvatar } from "@/components/transporteur/TransporteurAvatar";
import { CollectionPointsList } from "./CollectionPointsList";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tour, TourStatus } from "@/types/tour";
import { useState } from "react";
import AuthDialog from "@/components/auth/AuthDialog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface TourCardProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  onBookingClick: () => void;
  isBookingEnabled: boolean;
  isPickupSelectionEnabled: boolean;
  bookingButtonText: string;
}

export function TourCard({
  tour,
  selectedPickupCity,
  onPickupCitySelect,
  isBookingEnabled,
  isPickupSelectionEnabled,
  bookingButtonText,
}: TourCardProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();

  const handleBookingClick = async () => {
    if (!selectedPickupCity) return;

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    const userType = session.user.user_metadata?.user_type;
    if (userType !== 'client') {
      setShowAuthDialog(true);
      return;
    }

    navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TransporteurAvatar
            avatarUrl={tour.carriers?.avatar_url}
            companyName={tour.carriers?.company_name || ''}
          />
          <div>
            <h3 className="font-medium">{tour.carriers?.company_name}</h3>
            <p className="text-sm text-gray-500">
              Départ le {format(new Date(tour.departure_date), "d MMMM", { locale: fr })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Prix au kilo</p>
          <p className="font-medium">
            {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€
          </p>
        </div>
      </div>

      <TourTimeline status={tour.status as TourStatus} />
      
      <TourCapacityDisplay
        totalCapacity={tour.total_capacity}
        remainingCapacity={tour.remaining_capacity}
      />

      <CollectionPointsList
        points={tour.route}
        selectedPoint={selectedPickupCity}
        onPointSelect={onPickupCitySelect}
        isSelectionEnabled={isPickupSelectionEnabled}
        tourDepartureDate={tour.departure_date}
      />

      <Button 
        onClick={handleBookingClick}
        className="w-full"
        disabled={!isBookingEnabled}
      >
        {bookingButtonText}
      </Button>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          if (selectedPickupCity) {
            navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
          }
        }}
        requiredUserType="client"
      />
    </Card>
  );
}