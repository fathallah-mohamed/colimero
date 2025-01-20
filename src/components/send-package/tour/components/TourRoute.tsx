import { RouteStop } from "@/types/tour";
import { Truck, ArrowRight } from "lucide-react";

interface TourRouteProps {
  stops: RouteStop[];
  selectedPoint: string;
  onPointSelect: (point: string) => void;
}

export function TourRoute({ stops, selectedPoint, onPointSelect }: TourRouteProps) {
  const cities = stops?.map(stop => stop.name) || [];

  return (
    <div className="flex items-center gap-3 text-sm">
      <Truck className="h-4 w-4 flex-shrink-0 text-primary/70" />
      <div className="flex items-center gap-2 flex-wrap">
        {cities.map((city, index) => (
          <div 
            key={city} 
            className="flex items-center"
            onClick={() => onPointSelect(city)}
            role="button"
            tabIndex={0}
          >
            <span className={selectedPoint === city ? "text-primary font-medium" : ""}>
              {city}
            </span>
            {index < cities.length - 1 && (
              <ArrowRight className="h-4 w-4 mx-1 text-primary/70" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}