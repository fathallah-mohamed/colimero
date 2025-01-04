import { useState } from "react";
import { TourCardHeader } from "@/components/transporteur/TourCardHeader";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { TourTimeline } from "@/components/transporteur/TourTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  hideAvatar?: boolean;
  userType?: string | null;
}

export function TourTimelineCard({ tour, onBookingClick, hideAvatar, userType }: TourTimelineCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);

  const isBookingEnabled = () => {
    return selectedPickupCity && (tour.status === 'collecting' || tour.status === 'planned') && userType !== 'admin';
  };

  const isPickupSelectionEnabled = () => {
    return (tour.status === 'collecting' || tour.status === 'planned') && userType !== 'admin';
  };

  const getBookingButtonText = () => {
    if (tour.status === 'cancelled') return "Cette tournée a été annulée";
    if (userType === 'admin') return "Les administrateurs ne peuvent pas effectuer de réservations";
    if (tour.status === 'in_transit') return "Cette tournée est en cours de livraison";
    if (tour.status === 'completed') return "Cette tournée est terminée";
    if (!selectedPickupCity) return "Sélectionnez un point de collecte pour réserver";
    return "Réserver sur cette tournée";
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
          onClick={() => selectedPickupCity && onBookingClick(tour.id, selectedPickupCity)}
          className="w-full button-gradient text-white"
          disabled={!isBookingEnabled()}
        >
          {getBookingButtonText()}
        </Button>
      </div>
    </div>
  );
}