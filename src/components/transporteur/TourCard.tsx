import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Euro, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { TourTimeline } from "./TourTimeline";
import { TourCapacityDisplay } from "./TourCapacityDisplay";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";

interface TourCardProps {
  tour: any;
  onBookingClick?: (tourId: number, pickupCity: string) => void;
}

export function TourCard({ tour, onBookingClick }: TourCardProps) {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPickupCity, setSelectedPickupCity] = useState<string>('');
  const { toast } = useToast();
  const pricePerKg = tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 0;

  const handleRequestApproval = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour faire une demande d'approbation",
        variant: "destructive"
      });
      return;
    }
    setShowApprovalDialog(true);
  };

  const handleBookingClick = () => {
    if (onBookingClick && selectedPickupCity) {
      onBookingClick(tour.id, selectedPickupCity);
    }
  };

  const isBookingEnabled = () => {
    return selectedPickupCity && tour.status === "Programmé";
  };

  const getBookingButtonText = () => {
    if (!selectedPickupCity) return "Sélectionnez un point de collecte pour réserver";
    if (tour.status === "Annulée") return "Cette tournée a été annulée";
    if (tour.status === "Ramassage terminé") return "Cette tournée est en cours de collecte";
    if (tour.status === "Transport terminé") return "Cette tournée est en cours de livraison";
    if (tour.status === "Livraison terminée") return "Cette tournée est terminée";
    return "Réserver sur cette tournée";
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow">
      {/* Header with carrier info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <img 
            src={tour.carriers?.avatar_url || "/placeholder.svg"} 
            alt={tour.carriers?.company_name}
            className="w-8 h-8 rounded-full"
          />
        </div>
        <div>
          <h3 className="text-base font-medium">
            {tour.carriers?.company_name || "Express Transit"}
          </h3>
          <Badge variant="secondary" className="text-xs">
            Vérifié
          </Badge>
        </div>
      </div>

      {/* Route info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-5 w-5 text-primary/60" />
          <div>
            <p className="text-sm text-gray-500">Trajet</p>
            <p className="font-medium">
              {tour.departure_country === 'FR' ? 'France' : tour.departure_country} → {' '}
              {tour.destination_country === 'TN' ? 'Tunisie' : tour.destination_country}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Euro className="h-5 w-5 text-primary/60" />
          <div>
            <p className="text-sm text-gray-500">Prix</p>
            <p className="font-medium">{pricePerKg}€/kg</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-5 w-5 text-primary/60" />
          <div>
            <p className="text-sm text-gray-500">Date de départ</p>
            <p className="font-medium">
              {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>
      </div>

      {/* Expand/Collapse button */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2"
        >
          {isExpanded ? (
            <>
              Moins de détails
              <Minus className="h-4 w-4" />
            </>
          ) : (
            <>
              Plus de détails
              <Plus className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 pt-4"
          >
            <TourTimeline
              status={tour.status}
              tourId={tour.id}
            />

            <TourCapacityDisplay
              totalCapacity={tour.total_capacity}
              remainingCapacity={tour.remaining_capacity}
            />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Points de collecte</h4>
              <SelectableCollectionPointsList
                points={tour.route}
                selectedPoint={selectedPickupCity}
                onPointSelect={setSelectedPickupCity}
                isSelectionEnabled={true}
                tourDepartureDate={tour.departure_date}
              />
            </div>

            <Button
              onClick={handleBookingClick}
              className="w-full"
              disabled={!isBookingEnabled()}
            >
              {getBookingButtonText()}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <ApprovalRequestDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        tourId={tour.id}
        pickupCity={selectedPickupCity}
      />
    </div>
  );
}