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
}

export function TourTimelineCard({ tour, onBookingClick, hideAvatar }: TourTimelineCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);

  const isBookingEnabled = () => {
    return selectedPickupCity && tour.status === 'planned';
  };

  const getBookingButtonText = () => {
    if (!selectedPickupCity) return "Sélectionnez un point de collecte";
    if (tour.status !== 'planned') return "Indisponible";
    return "Réserver";
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
              onClick={() => setSelectedPickupCity(stop.name)}
              className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                selectedPickupCity === stop.name
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-200"
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
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={!isBookingEnabled()}
        >
          {getBookingButtonText()}
        </Button>
      </div>
    </div>
  );
}