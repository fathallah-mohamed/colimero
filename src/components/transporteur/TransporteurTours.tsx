import { TourCard } from "./TourCard";
import { Tour } from "@/types/tour";
import { useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import { Loader2 } from "lucide-react";

interface TransporteurToursProps {
  tours: Tour[];
  type: "public" | "private";
  isLoading?: boolean;
  userType?: string | null;
  handleBookingClick?: (tourId: number, pickupCity: string) => void;
}

export function TransporteurTours({ 
  tours, 
  isLoading, 
  handleBookingClick 
}: TransporteurToursProps) {
  const navigate = useNavigate();

  const onBookingClick = (tourId: number, pickupCity: string) => {
    if (handleBookingClick) {
      handleBookingClick(tourId, pickupCity);
    } else {
      navigate(`/reserver/${tourId}?pickupCity=${encodeURIComponent(pickupCity)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tours.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Aucune tournée disponible pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {tours.map((tour) => {
        const daysUntilDeparture = differenceInDays(
          new Date(tour.departure_date),
          new Date()
        );
        const isUpcoming = daysUntilDeparture <= 7 && daysUntilDeparture >= 0;

        return (
          <div
            key={tour.id}
            className="transform transition-all duration-200 hover:translate-y-[-2px]"
          >
            <TourCard
              tour={tour}
              onBookingClick={onBookingClick}
            />
          </div>
        );
      })}
    </div>
  );
}