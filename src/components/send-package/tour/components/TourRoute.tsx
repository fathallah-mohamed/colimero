import { Tour } from "@/types/tour";
import { Truck, Package, MapPin, ArrowRight } from "lucide-react";

interface TourRouteProps {
  tour: Tour;
}

export function TourRoute({ tour }: TourRouteProps) {
  const cities = tour.route?.map(stop => ({
    name: stop.name,
    type: stop.type
  })) || [];

  return (
    <div className="flex items-center gap-3">
      <Truck className="h-5 w-5 flex-shrink-0 text-primary/70" />
      <div className="flex items-center gap-3 flex-wrap">
        {cities.map((city, index) => (
          <div key={city.name} className="flex items-center">
            <span className="flex items-center gap-2">
              <span className="text-base">{city.name}</span>
              <span className="text-sm px-3 py-1 rounded-full bg-gray-100 flex items-center gap-1">
                {city.type === 'pickup' || city.type === 'ramassage' ? (
                  <>
                    <Package className="h-4 w-4" />
                    Ramassage
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    Livraison
                  </>
                )}
              </span>
            </span>
            {index < cities.length - 1 && (
              <ArrowRight className="h-5 w-5 mx-3 text-primary/70" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}