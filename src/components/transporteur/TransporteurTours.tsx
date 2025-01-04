import { TourTimelineCard } from "./tour/TourTimelineCard";
import { Tour } from "@/types/tour";
import { useNavigate } from "react-router-dom";

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
    <div className="space-y-6">
      {tours.map((tour) => (
        <TourTimelineCard
          key={tour.id}
          tour={tour}
          onBookingClick={handleBookingClick}
          hideAvatar={hideAvatar}
          userType={userType}
          showCollectionPoints={true}
        />
      ))}
    </div>
  );
}