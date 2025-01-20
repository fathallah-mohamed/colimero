import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TourRouteProps {
  stops: any[];
  selectedPoint: string;
  onPointSelect: (point: string) => void;
  departureDate: string;
  collectionDate: string;
}

export function TourRoute({ 
  stops, 
  selectedPoint, 
  onPointSelect,
  departureDate,
  collectionDate 
}: TourRouteProps) {
  return (
    <div className="mt-4">
      <div className="text-sm text-gray-500 mb-2">
        <div>
          Départ le {format(new Date(departureDate), "d MMMM yyyy", { locale: fr })}
        </div>
        <div>
          Collecte à partir du {format(new Date(collectionDate), "d MMMM yyyy", { locale: fr })}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {stops?.map((stop: any, index: number) => (
          <button
            key={`${stop.name}-${index}`}
            onClick={() => onPointSelect(stop.name)}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium transition-colors",
              selectedPoint === stop.name
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {stop.name}
          </button>
        ))}
      </div>
    </div>
  );
}