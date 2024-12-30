import { MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TourCollectionPointsProps {
  route: any[];
  selectedPoint?: string;
  onPointSelect: (cityName: string) => void;
}

export function TourCollectionPoints({ route, selectedPoint, onPointSelect }: TourCollectionPointsProps) {
  const getGoogleMapsUrl = (location: string, city: string) => {
    const query = encodeURIComponent(`${location}, ${city}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 text-sm text-gray-500 px-2">
        <span>Ville</span>
        <span>Adresse</span>
        <span>Jour et Heure</span>
        <span className="text-center">Sélection</span>
      </div>
      {route.map((stop, index) => (
        <div key={index} className="grid grid-cols-4 items-center text-sm">
          <span className="font-medium">{stop.name}</span>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <a 
              href={getGoogleMapsUrl(stop.location, stop.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              {stop.location}
            </a>
          </div>
          <div className="text-gray-600">
            <div>
              {format(new Date(stop.collection_date), "EEEE d MMMM yyyy", {
                locale: fr,
              })}
            </div>
            <div>{stop.time}</div>
          </div>
          <div className="flex justify-center">
            <input
              type="radio"
              name={`tour-${index}`}
              className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
              onChange={() => onPointSelect(stop.name)}
              checked={selectedPoint === stop.name}
            />
          </div>
        </div>
      ))}
    </div>
  );
}