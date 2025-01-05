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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tours.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Aucune tournée {type === "public" ? "publique" : "privée"} disponible
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:gap-6">
      {tours.map((tour) => {
        const daysUntilDeparture = differenceInDays(
          new Date(tour.departure_date),
          new Date()
        );
        const isUpcoming = daysUntilDeparture <= 7 && daysUntilDeparture >= 0;

        return (
          <TourTimelineCard
            key={tour.id}
            tour={tour}
            onBookingClick={handleBookingClick}
            hideAvatar={hideAvatar}
            userType={userType}
            isUpcoming={isUpcoming}
          />
        );
      })}
    </div>
  );
}