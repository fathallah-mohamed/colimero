import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { TourTimeline } from "@/components/transporteur/TourTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import AuthDialog from "@/components/auth/AuthDialog";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { CollectionPointsList } from "@/components/tour/CollectionPointsList";
import { Plus, Minus, MapPin, Calendar, TruckIcon, DollarSign, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  hideAvatar?: boolean;
  userType?: string | null;
  isUpcoming?: boolean;
}

export function TourTimelineCard({ 
  tour, 
  onBookingClick, 
  hideAvatar, 
  userType,
  isUpcoming = false
}: TourTimelineCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const firstCity = tour.route[0]?.name;
  const lastCity = tour.route[tour.route.length - 1]?.name;
  const pricePerKg = tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5;
  const daysUntilDeparture = differenceInDays(new Date(tour.departure_date), new Date());
  const isUrgent = daysUntilDeparture <= 3 && daysUntilDeparture >= 0;

  const handleBookingClick = async () => {
    if (!selectedPickupCity) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    const userType = session.user.user_metadata?.user_type;
    if (userType !== 'client') {
      setShowAuthDialog(true);
      return;
    }

    if (tour.type === 'private') {
      setShowApprovalDialog(true);
    } else {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white rounded-xl overflow-hidden transition-all duration-300",
        "border border-gray-100 hover:border-primary/20",
        "hover:shadow-lg shadow-md transform hover:-translate-y-1"
      )}
    >
      <div className="p-6 space-y-6">
        {/* En-tête de la carte */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div className="flex items-center gap-2">
                <span className="font-medium">{firstCity}</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{lastCity}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{format(new Date(tour.departure_date), "d MMMM", { locale: fr })}</span>
              </div>
              <div className="flex items-center gap-1">
                <TruckIcon className="h-4 w-4 text-primary" />
                <span>{tour.remaining_capacity} kg disponibles</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-medium">{pricePerKg}€/kg</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-primary"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Star className={cn("h-5 w-5", isFavorite && "fill-primary text-primary")} />
            </Button>
            {isUpcoming && (
              <Badge className="bg-success/10 text-success hover:bg-success/20">
                Prochaine tournée
              </Badge>
            )}
            {isUrgent && (
              <Badge variant="warning" className="animate-pulse">
                Départ imminent
              </Badge>
            )}
          </div>
        </div>

        {/* Barre de progression de la capacité */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ 
                width: `${((tour.total_capacity - tour.remaining_capacity) / tour.total_capacity) * 100}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Capacité utilisée: {tour.total_capacity - tour.remaining_capacity} kg</span>
            <span>Total: {tour.total_capacity} kg</span>
          </div>
        </div>

        {/* Bouton d'expansion */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-full transition-colors duration-200 hover:bg-primary/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="mr-2 text-sm font-medium text-muted-foreground">
              {isExpanded ? "Moins de détails" : "Plus de détails"}
            </span>
            {isExpanded ? (
              <Minus className="h-4 w-4 text-primary" />
            ) : (
              <Plus className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>

        {/* Contenu expansible */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-6 pt-4">
                <TourTimeline status={tour.status} />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
                  <CollectionPointsList
                    points={tour.route}
                    selectedPoint={selectedPickupCity}
                    onPointSelect={setSelectedPickupCity}
                    isSelectionEnabled={tour.status === 'planned'}
                    tourDepartureDate={tour.departure_date}
                  />
                </div>

                <Button 
                  onClick={handleBookingClick}
                  className="w-full button-gradient"
                  disabled={!selectedPickupCity || tour.status !== 'planned'}
                >
                  {!selectedPickupCity 
                    ? "Sélectionnez un point de collecte" 
                    : tour.type === 'private' 
                      ? "Demander l'approbation"
                      : "Réserver maintenant"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          if (selectedPickupCity) {
            if (tour.type === 'private') {
              setShowApprovalDialog(true);
            } else {
              navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
            }
          }
        }}
        requiredUserType="client"
      />

      <ApprovalRequestDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        tourId={tour.id}
        pickupCity={selectedPickupCity || ''}
      />
    </motion.div>
  );
}