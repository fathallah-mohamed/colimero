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
        <div className="flex flex-col gap-4">
          {/* Prix et capacité */}
          <div className="flex items-center justify-between">
            <span className="bg-primary/10 px-3 py-1 rounded-full text-sm font-medium text-primary">
              {pricePerKg} €/kg
            </span>
            <span className="text-green-600 dark:text-green-400 font-medium text-sm">
              {tour.remaining_capacity} kg disponibles
            </span>
          </div>

          {/* Transporteur */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-primary/10">
              <img 
                src={tour.carriers?.avatar_url || "/placeholder.svg"} 
                alt={tour.carriers?.company_name || "Carrier"} 
                className="object-cover"
              />
            </Avatar>
            <span className="text-sm font-medium text-gray-900">
              {tour.carriers?.company_name}
            </span>
          </div>

          {/* Trajet */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0 text-primary/70" />
            <div className="flex items-center gap-2 flex-wrap">
              {cities.map((city, index) => (
                <div key={city.name} className="flex items-center">
                  <span className="flex items-center gap-1">
                    {city.name}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
                      {city.type === 'pickup' ? 'Collecte' : 'Livraison'}
                    </span>
                  </span>
                  {index < cities.length - 1 && (
                    <ArrowRight className="h-4 w-4 mx-1 text-primary/70" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Date de départ */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {format(new Date(tour.departure_date), "d MMM yyyy", { locale: fr })}
            </span>
          </div>

          {/* Bouton détails */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-1" />
            {isExpanded ? "Masquer" : "Détails"}
            <ChevronDown className={cn(
              "h-4 w-4 ml-1 transition-transform duration-200",
              isExpanded && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Contenu détaillé */}
        {isExpanded && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
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
              className="w-full bg-gradient-primary hover:opacity-90 text-white transition-opacity"
              onClick={handleBookingClick}
              disabled={!selectedPoint}
            >
              {selectedPoint ? "Réserver maintenant" : "Sélectionnez un point de collecte"}
            </Button>
          </div>
        )}
      </div>
    </CardCustom>
  );
}