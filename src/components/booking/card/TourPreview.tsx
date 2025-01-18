import { Calendar, MapPin, Badge, Hash } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge as UIBadge } from "@/components/ui/badge";

interface TourPreviewProps {
  tour: any;
}

export function TourPreview({ tour }: TourPreviewProps) {
  if (!tour) return null;

  const route = tour.route || [];

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

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Villes de collecte:</span>
          </div>
          <div className="ml-6 space-y-1">
            {Array.isArray(route) && route.map((stop: any, index: number) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-sm"
              >
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>{stop.name}</span>
                <span className="text-gray-500">({stop.time})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UIBadge variant="outline" className="w-fit">
        Statut: {tour.status || "Non défini"}
      </UIBadge>
    </div>
  );
}