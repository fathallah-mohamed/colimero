import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientTourTimeline } from "./ClientTourTimeline";
import { ClientTourDetails } from "./ClientTourDetails";
import { Tour } from "@/types/tour";

interface ClientTourCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
}

export function ClientTourCard({ tour, onBookingClick }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pricePerKg = tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium">{tour.carriers?.company_name}</h3>
            <Badge variant="outline">{tour.type}</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>
                {tour.route?.[0]?.name} → {tour.route?.[tour.route.length - 1]?.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Départ : {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                Collecte : {format(new Date(tour.collection_date), "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-[#8B5CF6]">{pricePerKg}€/kg</p>
          <p className="text-sm text-gray-500">
            {tour.remaining_capacity} kg disponibles
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Eye className="h-4 w-4" />
        {isExpanded ? "Masquer les détails" : "Voir les détails"}
      </Button>

      {isExpanded && (
        <div className="space-y-4 mt-4">
          <ClientTourTimeline tour={tour} />
          <ClientTourDetails tour={tour} />
          <Button 
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
            onClick={() => onBookingClick(tour.id, tour.route?.[0]?.name || "")}
          >
            Réserver sur cette tournée
          </Button>
        </div>
      )}
    </div>
  );
}