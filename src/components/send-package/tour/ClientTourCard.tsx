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

interface ClientTourCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
}

export function ClientTourCard({ tour, onBookingClick }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  
  // Récupérer le prix par kg depuis les capacités du transporteur
  const pricePerKg = tour.carriers?.carrier_capacities?.price_per_kg || 0;

  const handleBookingClick = () => {
    if (selectedPoint) {
      onBookingClick(tour.id, selectedPoint);
    }
  };

  // Extraire les villes de la route
  const cities = tour.route?.map(stop => stop.name) || [];
  const routeDisplay = cities.join(" → ");

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary/10">
            <img 
              src={tour.carriers?.avatar_url || "/placeholder.svg"} 
              alt={tour.carriers?.company_name || "Carrier"} 
              className="object-cover"
            />
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {tour.carriers?.company_name}
            </h3>

            {/* Route Display */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 overflow-x-auto pb-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-primary/70" />
              <div className="flex items-center gap-2 flex-nowrap">
                {cities.map((city, index) => (
                  <div key={city} className="flex items-center">
                    <span className="whitespace-nowrap">{city}</span>
                    {index < cities.length - 1 && (
                      <ArrowRight className="h-4 w-4 mx-1 text-primary/70" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Departure Date */}
            <div className="mt-4 bg-primary/5 rounded-lg p-3 border border-primary/10">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Date de départ
                  </span>
                  <span className="text-base font-semibold text-primary">
                    {format(new Date(tour.departure_date), "d MMM yyyy", { locale: fr })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Package className="h-4 w-4 text-primary/70" />
                <span>{tour.remaining_capacity} kg disponibles</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm font-medium text-primary justify-end">
                <span className="bg-primary/10 px-3 py-1 rounded-full">
                  {pricePerKg}€/kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Details Button */}
        <Button
          variant="ghost"
          className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Eye className="h-4 w-4" />
          <span>{isExpanded ? "Masquer la tournée" : "Voir la tournée"}</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            isExpanded && "rotate-180"
          )} />
        </Button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-200">
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