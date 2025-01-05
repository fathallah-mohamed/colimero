import { TourCard } from "./TourCard";
import type { Tour } from "@/types/tour";

interface TransporteurToursProps {
  tours: Tour[];
  type: "public" | "private";
  isLoading: boolean;
  userType?: string | null;
  onAuthRequired?: () => void;
  hideAvatar?: boolean;
}

export function TransporteurTours({ 
  tours, 
  type,
  isLoading,
  userType,
  onAuthRequired,
  hideAvatar = false
}: TransporteurToursProps) {
  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-lg p-6 h-48" />
      ))}
    </div>;
  }

  if (!tours?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Aucune tournée {type === "public" ? "publique" : "privée"} disponible pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {tours.map((tour) => (
        <TourCard
          key={tour.id}
          tour={tour}
          onBookingClick={() => {
            if (!userType && onAuthRequired) {
              onAuthRequired();
            }
          }}
          hideAvatar={hideAvatar}
        />
      ))}
    </div>
  );
}