import { useState } from "react";
import { TourCardHeader } from "@/components/transporteur/TourCardHeader";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { TourTimeline } from "@/components/transporteur/TourTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import AuthDialog from "@/components/auth/AuthDialog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { CollectionPointsList } from "@/components/tour/CollectionPointsList";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  hideAvatar?: boolean;
  userType?: string | null;
}

export function TourTimelineCard({ tour, onBookingClick, hideAvatar, userType }: TourTimelineCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
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
    return tour.type === 'private' ? "Demander l'approbation" : "Réserver sur cette tournée";
  };

  const handleBookingClick = async () => {
    if (!selectedPickupCity) return;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthDialog(true);
    } else {
      if (tour.type === 'private') {
        setShowApprovalDialog(true);
      } else {
        onBookingClick(tour.id, selectedPickupCity);
      }
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
        <CollectionPointsList
          points={tour.route}
          selectedPoint={selectedPickupCity}
          onPointSelect={setSelectedPickupCity}
          isSelectionEnabled={isPickupSelectionEnabled()}
          tourDepartureDate={tour.departure_date}
        />
      </div>

      <div className="mt-4">
        <Button 
          onClick={handleBookingClick}
          className="w-full"
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
            if (tour.type === 'private') {
              setShowApprovalDialog(true);
            } else {
              onBookingClick(tour.id, selectedPickupCity);
            }
          }
        }}
        requiredUserType="client"
      />

      <ApprovalRequestDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        tourId={tour.id}
        pickupCity={selectedPickupCity || ''}
      />
    </div>
  );
}