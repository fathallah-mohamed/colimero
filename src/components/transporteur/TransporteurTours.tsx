import { TourTimelineCard } from "./tour/TourTimelineCard";
import { Tour } from "@/types/tour";
import { useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import { useBookingFlow } from "@/components/tour/useBookingFlow";

interface TransporteurToursProps {
  tours: Tour[];
  type: "public" | "private";
  isLoading?: boolean;
  hideAvatar?: boolean;
  userType?: string | null;
  onAuthRequired?: () => void;
}

export function TransporteurTours({ 
  tours, 
  type, 
  isLoading, 
  hideAvatar, 
  userType,
  onAuthRequired 
}: TransporteurToursProps) {
  const navigate = useNavigate();
  const { handleBookingClick } = useBookingFlow();

  const handleTourBooking = (tourId: number, pickupCity: string) => {
    if (!userType) {
      onAuthRequired?.();
      return;
    }
    handleBookingClick(tourId, pickupCity);
  };

  if (isLoading) {
    return <div>Chargement des tournées...</div>;
  }

  if (!tours.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Aucune tournée {type === "public" ? "publique" : "privée"} disponible
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {tours.map((tour) => {
        const daysUntilDeparture = differenceInDays(
          new Date(tour.departure_date),
          new Date()
        );
        const isUpcoming = daysUntilDeparture <= 7 && daysUntilDeparture >= 0;

        return (
          <div
            key={tour.id}
            className="transform transition-all duration-200 hover:translate-y-[-4px]"
          >
            <TourTimelineCard
              tour={tour}
              onBookingClick={handleTourBooking}
              hideAvatar={hideAvatar}
              isUpcoming={isUpcoming}
            />
          </div>
        );
      })}
    </div>
  );
}