import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TransporteurAvatar } from "../TransporteurAvatar";
import { TourTimeline } from "../TourTimeline";
import { TourCapacityDisplay } from "../TourCapacityDisplay";
import { Tour, TourStatus } from "@/types/tour";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  hideAvatar?: boolean;
  userType?: string | null;
  showCollectionPoints?: boolean;
}

export function TourTimelineCard({
  tour,
  onBookingClick,
  hideAvatar = false,
  userType,
  showCollectionPoints = false,
}: TourTimelineCardProps) {
  const isBookingEnabled = (tour: Tour) => {
    return tour.status === 'collecting' && userType !== 'admin';
  };

  const isPickupSelectionEnabled = (tour: Tour) => {
    return tour.status === 'collecting' && userType !== 'admin';
  };

  const getBookingButtonText = (tour: Tour) => {
    if (tour.status === 'cancelled') return "Cette tournée a été annulée";
    if (userType === 'admin') return "Les administrateurs ne peuvent pas effectuer de réservations";
    if (tour.status === 'planned') return "Cette tournée n'est pas encore ouverte aux réservations";
    if (tour.status === 'in_transit') return "Cette tournée est en cours de livraison";
    if (tour.status === 'completed') return "Cette tournée est terminée";
    return "Sélectionnez un point de collecte pour réserver";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE d MMMM yyyy", { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Date à confirmer";
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!hideAvatar && (
            <TransporteurAvatar
              avatarUrl={tour.carriers?.avatar_url}
              companyName={tour.carriers?.company_name || ''}
            />
          )}
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
            {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 0}€
          </p>
        </div>
      </div>

      <TourTimeline status={tour.status as TourStatus} />
      
      <TourCapacityDisplay
        totalCapacity={tour.total_capacity}
        remainingCapacity={tour.remaining_capacity}
      />

      {showCollectionPoints && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 text-sm text-gray-500 px-2">
            <span>Ville</span>
            <span>Adresse</span>
            <span>Date et Heure</span>
            <span>Sélection</span>
          </div>
          {(tour.route as any[]).map((stop, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg cursor-pointer border transition-colors hover:border-blue-200`}
              onClick={() => isPickupSelectionEnabled(tour) && onBookingClick(tour.id, stop.name)}
            >
              <div className="grid grid-cols-4 items-center text-sm">
                <span className="font-medium">{stop.name}</span>
                <span className="text-gray-600">{stop.location}</span>
                <div className="text-gray-600">
                  <div>
                    {stop.collection_date ? formatDate(stop.collection_date) : "Date à confirmer"}
                  </div>
                  <div>{stop.time || "Heure à confirmer"}</div>
                </div>
                <div className="flex justify-center">
                  <input
                    type="radio"
                    name={`tour-${tour.id}`}
                    className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    disabled={!isPickupSelectionEnabled(tour)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button 
        onClick={() => onBookingClick(tour.id, '')}
        className="w-full"
        disabled={!isBookingEnabled(tour)}
      >
        {getBookingButtonText(tour)}
      </Button>
    </Card>
  );
}