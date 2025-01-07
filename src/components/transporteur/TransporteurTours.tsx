import { Tour } from "@/types/tour";
import { TourCard } from "./TourCard";
import { Skeleton } from "@/components/ui/skeleton";
import { TourTimelineDisplay } from "../tour/shared/TourTimelineDisplay";
import { ClientTimeline } from "../tour/timeline/client/ClientTimeline";

interface TransporteurToursProps {
  tours: Tour[];
  type?: "public" | "private";
  isLoading?: boolean;
  userType?: string | null;
  handleBookingClick?: (tourId: number, pickupCity: string) => void;
  TimelineComponent?: typeof TourTimelineDisplay | typeof ClientTimeline;
}

export function TransporteurTours({ 
  tours, 
  type = "public",
  isLoading,
  userType,
  handleBookingClick,
  TimelineComponent = TourTimelineDisplay
}: TransporteurToursProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (!tours?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">Aucune tournée disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <TourCard
          key={tour.id}
          tour={tour}
          type={type}
          userType={userType}
          onBookingClick={handleBookingClick}
          TimelineComponent={TimelineComponent}
        />
      ))}
    </div>
  );
}