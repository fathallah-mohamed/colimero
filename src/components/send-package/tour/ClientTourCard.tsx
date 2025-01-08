import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Eye, Package, ChevronDown, ArrowRight, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { cn } from "@/lib/utils";
import { CardCustom } from "@/components/ui/card-custom";
import { TransporteurAvatar } from "@/components/transporteur/TransporteurAvatar";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import AuthDialog from "@/components/auth/AuthDialog";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const navigate = useNavigate();
  
  const {
    showAuthDialog,
    setShowAuthDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    handleBookingClick,
    handleAuthSuccess
  } = useBookingFlow();
  
  const pricePerKg = tour.carriers?.carrier_capacities?.price_per_kg || 0;
  const firstCollectionDate = new Date(tour.collection_date);
  const departureDate = new Date(tour.departure_date);
  const tourDuration = differenceInDays(departureDate, firstCollectionDate);

  const handleBookingButtonClick = async () => {
    if (!selectedPoint) {
      toast({
        variant: "destructive",
        title: "Point de ramassage requis",
        description: "Veuillez sélectionner un point de ramassage avant de réserver",
      });
      return;
    }

    try {
      await handleBookingClick(tour.id, selectedPoint);
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
      });
    }
  };

  // Filter only pickup points from the route
  const pickupPoints = tour.route?.filter(stop => 
    stop.type === 'pickup' || stop.type === 'ramassage'
  ) || [];

  const cities = tour.route?.map(stop => ({
    name: stop.name,
    type: stop.type
  })) || [];

  return (
    <CardCustom className="bg-white hover:bg-gray-50 transition-colors duration-200">
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Transporteur */}
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

            {/* Date de départ */}
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div className="flex flex-col">
                <span className="text-sm text-blue-600 font-medium">Date de départ</span>
                <span className="text-base font-semibold text-blue-700">
                  {format(departureDate, "d MMM yyyy", { locale: fr })}
                </span>
              </div>
            </div>

            {/* Durée de la tournée */}
            <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
              <div className="flex flex-col">
                <span className="text-sm text-purple-600 font-medium">Durée de la tournée</span>
                <span className="text-base font-semibold text-purple-700">
                  {tourDuration} jours
                </span>
              </div>
            </div>

            {/* Prix et capacité */}
            <div className="flex flex-col gap-2">
              <span className="bg-primary/10 px-4 py-2 rounded-full text-base font-medium text-primary text-center">
                {pricePerKg} €/kg
              </span>
              <span className="text-green-600 dark:text-green-400 font-medium text-base text-center px-4 py-2 bg-green-50 rounded-lg">
                {tour.remaining_capacity} kg disponibles
              </span>
            </div>
          </div>

          {/* Trajet */}
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 flex-shrink-0 text-primary/70" />
            <div className="flex items-center gap-3 flex-wrap">
              {cities.map((city, index) => (
                <div key={city.name} className="flex items-center">
                  <span className="flex items-center gap-2">
                    <span className="text-base">{city.name}</span>
                    <span className="text-sm px-3 py-1 rounded-full bg-gray-100 flex items-center gap-1">
                      {city.type === 'pickup' || city.type === 'ramassage' ? (
                        <>
                          <Package className="h-4 w-4" />
                          Ramassage
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4" />
                          Livraison
                        </>
                      )}
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
                points={pickupPoints}
                selectedPoint={selectedPoint}
                onPointSelect={setSelectedPoint}
                isSelectionEnabled={true}
                tourDepartureDate={tour.departure_date}
              />

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                onClick={handleBookingButtonClick}
                disabled={!selectedPoint}
              >
                {selectedPoint ? "Réserver maintenant" : "Sélectionnez un point de ramassage"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />
    </CardCustom>
  );
}