import { Tour } from "@/types/tour";
import { Truck, ArrowRight } from "lucide-react";

interface TourRouteProps {
  tour: Tour;
}

export function TourRoute({ tour }: TourRouteProps) {
  const cities = tour.route?.map(stop => stop.name) || [];

  return (
    <div className="flex items-center gap-3 text-sm">
      <Truck className="h-4 w-4 flex-shrink-0 text-primary/70" />
      <div className="flex items-center gap-2 flex-wrap">
        {cities.map((city, index) => (
          <div key={city} className="flex items-center">
            <span>{city}</span>
            {index < cities.length - 1 && (
              <ArrowRight className="h-4 w-4 mx-1 text-primary/70" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}