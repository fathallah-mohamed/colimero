import { TourTimelineCard } from "./tour/TourTimelineCard";
import { Tour } from "@/types/tour";
import { useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";

interface TransporteurToursProps {
  tours: Tour[];
  type: "public" | "private";
  isLoading?: boolean;
  hideAvatar?: boolean;
  userType?: string | null;
}

export function TransporteurTours({ tours, type, isLoading, hideAvatar, userType }: TransporteurToursProps) {
  const navigate = useNavigate();

  const handleBookingClick = (tourId: number, pickupCity: string) => {
    navigate(`/reserver/${tourId}?pickupCity=${encodeURIComponent(pickupCity)}`);
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
              onBookingClick={handleBookingClick}
              hideAvatar={hideAvatar}
            />
          </div>
        );
      })}
    </div>
  );
}