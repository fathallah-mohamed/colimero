import { Tour } from "@/types/tour";
import { TourCardHeader } from "@/components/transporteur/TourCardHeader";
import { TourTimelineDisplay } from "../../tour/shared/TourTimelineDisplay";
import { ClientTimeline } from "../../tour/timeline/client/ClientTimeline";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, CreditCard, AlertOctagon } from "lucide-react";
import { useState } from "react";
import { SelectableCollectionPointsList } from "../../tour/SelectableCollectionPointsList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface TourCardProps {
  tour: Tour;
  type?: "public" | "private";
  userType?: string | null;
  onBookingClick?: (tourId: number, pickupCity: string) => void;
  TimelineComponent?: typeof TourTimelineDisplay | typeof ClientTimeline;
}

export function ClientTourCard({ 
  tour, 
  type = "public",
  userType,
  TimelineComponent = TourTimelineDisplay
}: TourCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const navigate = useNavigate();

  const handleBookingClick = () => {
    if (selectedPoint) {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`);
    }
  };

  // Vérifier si l'utilisateur peut réserver (client uniquement et tournée programmée)
  const canBook = tour.status === "Programmée" && userType !== "carrier";

  const getBookingStatusMessage = () => {
    if (userType === "carrier") {
      return "Les transporteurs ne peuvent pas effectuer de réservations. Seuls les clients peuvent réserver des tournées.";
    }
    if (tour.status !== "Programmée") {
      return `Cette tournée est en statut "${tour.status}" et ne peut pas être réservée`;
    }
    return "";
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <TourCardHeader
        tour={tour}
        type={type}
        userType={userType}
      />
      <div className="p-6 space-y-6">
        <TimelineComponent 
          status={tour.status} 
          tourId={tour.id}
        />

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Eye className="h-4 w-4" />
            {showDetails ? "Masquer les détails" : "Voir les détails"}
          </Button>

          {showDetails && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-200">
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Capacité restante</p>
                  <p className="font-medium">{tour.remaining_capacity} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prix par kg</p>
                  <p className="font-medium">{tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 0} €</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Points de collecte</h3>
                <SelectableCollectionPointsList
                  points={tour.route}
                  selectedPoint={selectedPoint}
                  onPointSelect={setSelectedPoint}
                  isSelectionEnabled={canBook}
                  tourDepartureDate={tour.departure_date}
                />
              </div>

              {!canBook && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertOctagon className="h-4 w-4" />
                  <AlertDescription>
                    {getBookingStatusMessage()}
                  </AlertDescription>
                </Alert>
              )}

              {canBook && (
                <Button
                  className="w-full flex items-center gap-2 bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white"
                  onClick={handleBookingClick}
                  disabled={!selectedPoint}
                >
                  <CreditCard className="h-4 w-4" />
                  {selectedPoint ? "Réserver sur cette tournée" : "Sélectionnez un point de collecte"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}