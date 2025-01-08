import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Eye, Package, ChevronDown, ArrowRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { Avatar } from "@/components/ui/avatar";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { cn } from "@/lib/utils";

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
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-6">
          {/* Prix et Capacité - Les informations les plus importantes */}
          <div className="flex-shrink-0 w-48">
            <div className="text-2xl font-bold text-primary flex items-center gap-1 mb-2">
              <DollarSign className="h-6 w-6" />
              {pricePerKg}€<span className="text-sm font-normal">/kg</span>
            </div>
            <div className="text-sm text-green-600 font-medium bg-green-50 rounded-full px-3 py-1 inline-flex items-center">
              <Package className="h-4 w-4 mr-1" />
              {tour.remaining_capacity} kg disponibles
            </div>
          </div>

          {/* Trajet */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-base text-gray-700">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {cities.map((city, index) => (
                  <div key={city.name} className="flex items-center whitespace-nowrap">
                    <span className="flex items-center">
                      {city.name}
                      <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-gray-100">
                        {city.type === 'pickup' ? 'Collecte' : 'Livraison'}
                      </span>
                    </span>
                    {index < cities.length - 1 && (
                      <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transporteur et Date */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                <img 
                  src={tour.carriers?.avatar_url || "/placeholder.svg"} 
                  alt={tour.carriers?.company_name || "Carrier"} 
                  className="object-cover"
                />
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">
                  {tour.carriers?.company_name}
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-3 min-w-[180px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-gray-500">Date de départ</div>
                  <div className="font-semibold text-primary">
                    {format(new Date(tour.departure_date), "d MMM yyyy", { locale: fr })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton d'expansion */}
          <Button
            variant="ghost"
            size="sm"
            className="ml-4"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isExpanded ? "Masquer" : "Détails"}
            <ChevronDown className={cn(
              "h-4 w-4 ml-2 transition-transform duration-200",
              isExpanded && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Contenu expansé */}
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
              className="w-full bg-gradient-primary hover:opacity-90 text-white transition-opacity"
              onClick={handleBookingClick}
              disabled={!selectedPoint}
            >
              {selectedPoint ? "Réserver maintenant" : "Sélectionnez un point de collecte"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}