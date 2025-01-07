import { Tour } from "@/types/tour";
import { TourCardHeader } from "./TourCardHeader";
import { TourTimelineDisplay } from "../tour/shared/TourTimelineDisplay";
import { ClientTimeline } from "../tour/timeline/client/ClientTimeline";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Eye, MapPin, CreditCard } from "lucide-react";
import { useState } from "react";

interface TourCardProps {
  tour: Tour;
  type?: "public" | "private";
  userType?: string | null;
  onBookingClick?: (tourId: number, pickupCity: string) => void;
  TimelineComponent?: typeof TourTimelineDisplay | typeof ClientTimeline;
}

export function TourCard({ 
  tour, 
  type = "public",
  userType,
  onBookingClick,
  TimelineComponent = TourTimelineDisplay
}: TourCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showCollectionPoints, setShowCollectionPoints] = useState(false);

  const handleBookingClick = () => {
    if (onBookingClick && tour.route.length > 0) {
      onBookingClick(tour.id, tour.route[0].name);
    }
  };

  return (
    <Card className="overflow-hidden">
      <TourCardHeader
        tour={tour}
        type={type}
        userType={userType}
      />
      <div className="p-4">
        <TimelineComponent 
          status={tour.status} 
          tourId={tour.id}
        />

        {/* Boutons d'action */}
        <div className="mt-4 flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 text-[#0FA0CE] hover:text-[#0FA0CE]/90 border-[#0FA0CE] hover:border-[#0FA0CE]/90 hover:bg-[#0FA0CE]/10"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Eye className="h-4 w-4" />
            {showDetails ? "Masquer les détails" : "Afficher les détails"}
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2 text-[#0FA0CE] hover:text-[#0FA0CE]/90 border-[#0FA0CE] hover:border-[#0FA0CE]/90 hover:bg-[#0FA0CE]/10"
            onClick={() => setShowCollectionPoints(!showCollectionPoints)}
          >
            <MapPin className="h-4 w-4" />
            {showCollectionPoints ? "Masquer les points de collecte" : "Points de collecte"}
          </Button>

          <Button
            className="w-full flex items-center gap-2 bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white"
            onClick={handleBookingClick}
          >
            <CreditCard className="h-4 w-4" />
            Réserver sur cette tournée
          </Button>
        </div>

        {/* Affichage des détails */}
        {showDetails && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Capacité restante</p>
              <p className="font-medium">{tour.remaining_capacity} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Prix par kg</p>
              <p className="font-medium">{tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 0} €</p>
            </div>
          </div>
        )}

        {/* Affichage des points de collecte */}
        {showCollectionPoints && (
          <div className="mt-4 space-y-2">
            {tour.route.map((point, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{point.name}</p>
                <p className="text-sm text-gray-600">{point.location}</p>
                <p className="text-sm text-gray-600">{point.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}