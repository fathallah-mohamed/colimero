import { useState } from "react";
import { TourCardHeader } from "@/components/transporteur/TourCardHeader";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { TourTimeline } from "@/components/transporteur/TourTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import AuthDialog from "@/components/auth/AuthDialog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  hideAvatar?: boolean;
  userType?: string | null;
}

export function TourTimelineCard({ tour, onBookingClick, hideAvatar, userType }: TourTimelineCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();

  const isBookingEnabled = () => {
    return selectedPickupCity && tour.status === 'planned' && userType !== 'admin';
  };

  const isPickupSelectionEnabled = () => {
    return tour.status === 'planned' && userType !== 'admin';
  };

  const getBookingButtonText = () => {
    if (tour.status === 'cancelled') return "Cette tournée a été annulée et n'est pas ouverte à la réservation";
    if (userType === 'admin') return "Les administrateurs ne peuvent pas effectuer de réservations";
    if (tour.status === 'collecting') return "Cette tournée est en cours de collecte et n'est pas ouverte à la réservation";
    if (tour.status === 'in_transit') return "Cette tournée est en cours de livraison et n'est pas ouverte à la réservation";
    if (tour.status === 'completed') return "Cette tournée est terminée et n'est pas ouverte à la réservation";
    if (!selectedPickupCity) return "Sélectionnez un point de collecte pour réserver";
    return "Réserver sur cette tournée";
  };

  const handleBookingClick = async () => {
    if (!selectedPickupCity) return;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthDialog(true);
    } else {
      onBookingClick(tour.id, selectedPickupCity);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <TourCardHeader 
        tour={tour}
        hideAvatar={hideAvatar}
      />
      
      <TourTimeline 
        status={tour.status || 'planned'}
      />
      
      <TourCapacityDisplay 
        totalCapacity={tour.total_capacity} 
        remainingCapacity={tour.remaining_capacity} 
      />

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
        <div className="space-y-2">
          {(tour.route || []).map((stop, index) => (
            <div
              key={index}
              onClick={() => isPickupSelectionEnabled() && setSelectedPickupCity(stop.name)}
              className={`p-3 rounded-lg transition-colors ${
                !isPickupSelectionEnabled() ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
              } ${
                selectedPickupCity === stop.name
                  ? "border-2 border-primary bg-primary/10"
                  : isPickupSelectionEnabled()
                    ? "border border-gray-200 hover:border-primary/50"
                    : "border border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{stop.name}</p>
                  <p className="text-sm text-gray-500">{stop.location}</p>
                </div>
                <p className="text-sm text-gray-500">{stop.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Button 
          onClick={handleBookingClick}
          className="w-full bg-primary hover:bg-primary-hover text-white transition-colors"
          disabled={!isBookingEnabled()}
        >
          {getBookingButtonText()}
        </Button>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          if (selectedPickupCity) {
            onBookingClick(tour.id, selectedPickupCity);
          }
        }}
        requiredUserType="client"
      />
    </div>
  );
}