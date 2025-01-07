import { Tour } from "@/types/tour";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, MapPin } from "lucide-react";

interface ClientTourDetailsProps {
  tour: Tour;
}

export function ClientTourDetails({ tour }: ClientTourDetailsProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Détails de la tournée</h4>
      <div className="grid gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <div>
            <p className="text-sm text-gray-500">Dates importantes</p>
            <p className="font-medium">
              Départ : {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
            </p>
            <p className="font-medium">
              Collecte : {format(new Date(tour.collection_date), "d MMMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <div>
            <p className="text-sm text-gray-500">Trajet</p>
            <p className="font-medium">
              {tour.departure_country} → {tour.destination_country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}