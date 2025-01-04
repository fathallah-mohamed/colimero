import { TourStatusTimeline } from "@/components/tour/TourStatusTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { TourCardHeader } from "@/components/transporteur/TourCardHeader";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  hideAvatar?: boolean;
}

export function TourTimelineCard({ tour, onBookingClick, hideAvatar }: TourTimelineCardProps) {
  const isBookingEnabled = () => {
    return tour.status === 'planned' || tour.status === 'collecting';
  };

  const getFirstPickupCity = () => {
    if (!tour.route || !Array.isArray(tour.route)) return '';
    return tour.route[0]?.name || '';
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <TourCardHeader 
        tour={tour}
        hideAvatar={hideAvatar}
      />
      
      <TourStatusTimeline 
        tourId={tour.id}
        currentStatus={tour.status || 'planned'}
        onStatusChange={() => {}}
        isCompleted={tour.status === 'completed'}
      />
      
      <TourCapacityDisplay 
        totalCapacity={tour.total_capacity} 
        remainingCapacity={tour.remaining_capacity} 
      />
      
      <div className="mt-6">
        <Button 
          onClick={() => onBookingClick(tour.id, getFirstPickupCity())}
          className="w-full"
          disabled={!isBookingEnabled()}
        >
          {tour.type === 'private' ? 'Demander l\'approbation' : 'Réserver'}
        </Button>
      </div>
    </div>
  );
}