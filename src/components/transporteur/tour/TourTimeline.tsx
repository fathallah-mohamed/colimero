import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";

interface TourTimelineProps {
  route: Tour['route'];
  onBookingClick: (city: string) => void;
  isBookingEnabled: boolean;
  bookingButtonText: string;
}

export function TourTimeline({ 
  route, 
  onBookingClick, 
  isBookingEnabled,
  bookingButtonText 
}: TourTimelineProps) {
  return (
    <div className="space-y-4">
      {route.map((stop, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium">{stop.name}</h4>
            <p className="text-sm text-gray-500">{stop.location}</p>
            <p className="text-sm text-gray-500">{stop.time}</p>
          </div>
          {stop.type === 'pickup' && (
            <Button
              onClick={() => onBookingClick(stop.name)}
              disabled={!isBookingEnabled}
              variant={isBookingEnabled ? "default" : "outline"}
              title={bookingButtonText}
            >
              {isBookingEnabled ? "Réserver" : "Indisponible"}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}