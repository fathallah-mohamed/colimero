import { MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CollectionPointRowProps {
  name: string;
  location: string;
  time: string;
  collectionDate: string;
  isSelected?: boolean;
  onSelect?: () => void;
  selectionEnabled?: boolean;
}

export function CollectionPointRow({
  name,
  location,
  time,
  collectionDate,
  isSelected,
  onSelect,
  selectionEnabled = true
}: CollectionPointRowProps) {
  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(`${location}, ${name}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE d MMMM yyyy", {
        locale: fr,
      });
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Date non disponible";
    }
  };

  return (
    <div className="grid grid-cols-5 items-center text-sm">
      <span className="font-medium">{name}</span>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-400" />
        <a 
          href={getGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-500 transition-colors"
        >
          {location}
        </a>
      </div>
      <div className="text-gray-600">
        {formatDate(collectionDate)}
      </div>
      <div className="text-gray-600">
        {time}
      </div>
      <div className="flex justify-center">
        {selectionEnabled && (
          <input
            type="radio"
            name="collection-point"
            className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
            onChange={onSelect}
            checked={isSelected}
          />
        )}
      </div>
    </div>
  );
}