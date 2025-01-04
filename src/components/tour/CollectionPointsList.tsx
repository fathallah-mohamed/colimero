import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CollectionPoint {
  name: string;
  location: string;
  time: string;
  collection_date?: string;
}

interface CollectionPointsListProps {
  points: CollectionPoint[];
  selectedPoint: string | null;
  onPointSelect: (cityName: string) => void;
  isSelectionEnabled: boolean;
  tourDepartureDate: string;
}

export function CollectionPointsList({
  points,
  selectedPoint,
  onPointSelect,
  isSelectionEnabled,
  tourDepartureDate
}: CollectionPointsListProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 text-sm text-gray-500 px-2">
        <span>Ville</span>
        <span>Adresse</span>
        <span>Date</span>
        <span>Heure</span>
        <span className="text-center">Sélection</span>
      </div>
      {points.map((point, index) => (
        <div
          key={index}
          onClick={() => isSelectionEnabled && onPointSelect(point.name)}
          className={`p-3 rounded-lg ${
            isSelectionEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
          } border transition-colors ${
            selectedPoint === point.name
              ? "border-blue-500 bg-blue-50"
              : isSelectionEnabled
                ? "border-gray-200 hover:border-blue-200"
                : "border-gray-200"
          }`}
        >
          <div className="grid grid-cols-6 items-center text-sm">
            <span className="font-medium">{point.name}</span>
            <span className="text-gray-600">{point.location}</span>
            <span className="text-gray-600">
              {point.collection_date ? (
                format(
                  new Date(point.collection_date), 
                  "EEEE d MMMM", 
                  { locale: fr }
                )
              ) : (
                <span className="text-yellow-600 italic">Date à confirmer</span>
              )}
            </span>
            <span className="text-gray-600">{point.time}</span>
            <div className="flex justify-center">
              <input
                type="radio"
                name={`point-${index}`}
                checked={selectedPoint === point.name}
                onChange={() => isSelectionEnabled && onPointSelect(point.name)}
                className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                disabled={!isSelectionEnabled}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}