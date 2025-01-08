import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Eye, Package, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { Avatar } from "@/components/ui/avatar";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { cn } from "@/lib/utils";
import { CardCustom } from "@/components/ui/card-custom";
import { TransporteurAvatar } from "@/components/transporteur/TransporteurAvatar";

interface ClientTourCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
}

export function ClientTourCard({ tour, onBookingClick }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  
  const pricePerKg = tour.carriers?.carrier_capacities?.price_per_kg || 0;

  const handleBookingClick = () => {
    if (selectedPoint) {
      onBookingClick(tour.id, selectedPoint);
    }
  };

  const cities = tour.route?.map(stop => ({
    name: stop.name,
    type: stop.type
  })) || [];

  return (
    <CardCustom className="bg-white hover:bg-gray-50 transition-colors duration-200">
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Informations principales */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Transporteur - Déplacé à gauche */}
            <div className="flex items-center gap-3">
              <TransporteurAvatar 
                avatarUrl={tour.carriers?.avatar_url}
                companyName={tour.carriers?.company_name || ""}
                size="md"
              />
              <span className="text-base font-medium text-gray-900">
                {tour.carriers?.company_name}
              </span>
            </div>

            {/* Prix et capacité */}
            <div className="flex items-center gap-6">
              <span className="bg-primary/10 px-4 py-2 rounded-full text-base font-medium text-primary min-w-[100px] text-center">
                {pricePerKg} €/kg
              </span>
              <span className="text-green-600 dark:text-green-400 font-medium text-base min-w-[150px]">
                {tour.remaining_capacity} kg disponibles
              </span>
            </div>

            {/* Date de départ */}
            <div className="flex items-center gap-2 min-w-[200px]">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-base font-medium">
                {format(new Date(tour.departure_date), "d MMM yyyy", { locale: fr })}
              </span>
            </div>
          </div>

          {/* Trajet */}
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 flex-shrink-0 text-primary/70" />
            <div className="flex items-center gap-3 flex-wrap">
              {cities.map((city, index) => (
                <div key={city.name} className="flex items-center">
                  <span className="flex items-center gap-2">
                    <span className="text-base">{city.name}</span>
                    <span className="text-sm px-3 py-1 rounded-full bg-gray-100">
                      {city.type === 'pickup' ? 'Collecte' : 'Livraison'}
                    </span>
                  </span>
                  {index < cities.length - 1 && (
                    <ArrowRight className="h-5 w-5 mx-3 text-primary/70" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bouton détails */}
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-colors group"
          >
            <Eye className="h-5 w-5 mr-2 text-blue-500 group-hover:text-blue-600" />
            {isExpanded ? "Masquer les informations" : "Voir les informations détaillées"}
            <ChevronDown className={cn(
              "h-5 w-5 ml-2 text-blue-500 transition-transform duration-200 group-hover:text-blue-600",
              isExpanded && "rotate-180"
            )} />
          </Button>

          {/* Contenu détaillé */}
          {isExpanded && (
            <div className="mt-6 space-y-6 animate-in slide-in-from-top-4 duration-200">
              <ClientTimeline 
                status={tour.status} 
                tourId={tour.id}
              />

              <TourCapacityDisplay 
                totalCapacity={tour.total_capacity} 
                remainingCapacity={tour.remaining_capacity} 
              />
              
              <SelectableCollectionPointsList
                points={tour.route || []}
                selectedPoint={selectedPoint}
                onPointSelect={setSelectedPoint}
                isSelectionEnabled={true}
                tourDepartureDate={tour.departure_date}
              />

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                onClick={handleBookingClick}
                disabled={!selectedPoint}
              >
                {selectedPoint ? "Réserver maintenant" : "Sélectionnez un point de collecte"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </CardCustom>
  );
}