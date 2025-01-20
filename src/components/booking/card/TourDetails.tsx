import { Calendar, MapPin, Truck, Hash } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { TourRoute } from "@/components/send-package/tour/components/TourRoute";
import { useState } from "react";

interface TourDetailsProps {
  tour: any;
}

export function TourDetails({ tour }: TourDetailsProps) {
  const [selectedPoint, setSelectedPoint] = useState("");

  if (!tour) return null;

  const handlePointSelect = (point: string) => {
    setSelectedPoint(point);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-primary">
          {tour.tour_number || "Numéro non défini"}
        </span>
      </div>

      {tour.carriers && (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm font-medium">{tour.carriers.company_name}</p>
            {tour.carriers.phone && (
              <p className="text-sm text-gray-600">{tour.carriers.phone}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">Dates</p>
          <p className="text-sm">
            Départ: {tour.departure_date 
              ? format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })
              : "Non définie"}
          </p>
          <p className="text-sm">
            Collecte: {tour.collection_date 
              ? format(new Date(tour.collection_date), "d MMMM yyyy", { locale: fr })
              : "Non définie"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">Trajet</p>
          <p className="text-sm">
            {tour.departure_country} → {tour.destination_country}
          </p>
        </div>
      </div>

      <Badge variant="outline" className="text-sm">
        Statut de la tournée: {tour.status || "Non défini"}
      </Badge>

      {tour.route && (
        <div className="pt-2">
          <TourRoute 
            stops={tour.route}
            selectedPoint={selectedPoint}
            onPointSelect={handlePointSelect}
            departureDate={tour.departure_date}
            collectionDate={tour.collection_date}
          />
        </div>
      )}
    </div>
  );
}