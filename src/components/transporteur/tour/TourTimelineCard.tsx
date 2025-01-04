import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { TourCardHeader } from "@/components/transporteur/TourCardHeader";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { TourTimeline } from "@/components/transporteur/TourTimeline";
import { useState } from "react";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  hideAvatar?: boolean;
}

export function TourTimelineCard({ tour, onBookingClick, hideAvatar }: TourTimelineCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);

  const isBookingEnabled = () => {
    // Activer seulement si une ville est sélectionnée et le statut est "planned"
    return selectedPickupCity && tour.status === 'planned';
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <TourCardHeader 
        tour={tour}
        hideAvatar={hideAvatar}
      />
      
      <TourTimeline status={tour.status || 'planned'} />
      
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
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-200"
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
          onClick={() => onBookingClick(tour.id, selectedPickupCity!)}
          className="w-full"
          disabled={!isBookingEnabled()}
        >
          {!selectedPickupCity 
            ? "Sélectionnez un point de collecte" 
            : tour.type === 'private' 
              ? "Demander l'approbation" 
              : "Réserver"}
        </Button>
      </div>
    </div>
  );
}