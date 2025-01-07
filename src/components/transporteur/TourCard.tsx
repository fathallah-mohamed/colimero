import { Tour } from "@/types/tour";
import { TourCardHeader } from "./TourCardHeader";
import { TourTimelineDisplay } from "../tour/shared/TourTimelineDisplay";
import { ClientTimeline } from "../tour/timeline/client/ClientTimeline";
import { Card } from "../ui/card";

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
  return (
    <Card className="overflow-hidden">
      <TourCardHeader
        tour={tour}
        type={type}
        userType={userType}
        onBookingClick={onBookingClick}
      />
      <div className="p-4">
        <TimelineComponent 
          status={tour.status} 
          tourId={tour.id}
        />
      </div>
    </Card>
  );
}