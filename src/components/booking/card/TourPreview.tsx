import { Calendar, MapPin, Hash, Flag } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge as UIBadge } from "@/components/ui/badge";

interface TourPreviewProps {
  tour: any;
}

export function TourPreview({ tour }: TourPreviewProps) {
  if (!tour) return null;

  const getCountryFlag = (countryCode: string) => {
    return countryCode === 'FR' ? '🇫🇷' : '🇹🇳';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-primary">
          {tour.tour_number || "Numéro non défini"}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {tour.departure_date 
              ? format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })
              : "Date non définie"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-gray-500" />
          <div className="flex items-center gap-2">
            <span className="text-sm flex items-center gap-1">
              <span>{getCountryFlag(tour.departure_country)}</span>
              <span>{tour.departure_country}</span>
            </span>
            <span className="text-gray-500">→</span>
            <span className="text-sm flex items-center gap-1">
              <span>{getCountryFlag(tour.destination_country)}</span>
              <span>{tour.destination_country}</span>
            </span>
          </div>
        </div>
      </div>

      <UIBadge variant="outline" className="w-fit">
        Statut: {tour.status || "Non défini"}
      </UIBadge>
    </div>
  );
}