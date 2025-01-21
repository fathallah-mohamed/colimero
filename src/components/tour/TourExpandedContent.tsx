import { Tour, TourStatus } from "@/types/tour";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TourExpandedContentProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  onActionClick: () => void;
  isActionEnabled: boolean;
  actionButtonText: string;
  userType?: string;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
}

export function TourExpandedContent({
  tour,
  selectedPickupCity,
  onPickupCitySelect,
  onActionClick,
  isActionEnabled,
  actionButtonText,
  userType,
  onStatusChange
}: TourExpandedContentProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBookingClick = async () => {
    if (!selectedPickupCity) {
      toast({
        variant: "destructive",
        title: "Point de collecte requis",
        description: "Veuillez sélectionner un point de collecte avant de réserver",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Store the booking path for redirect after login
        const bookingPath = `/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`;
        sessionStorage.setItem('returnPath', bookingPath);
        navigate('/connexion');
        return;
      }

      // If user is logged in, proceed with booking
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
    } catch (error) {
      console.error("Error checking session:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification de votre session",
      });
    }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="pt-6 space-y-6">
        <ClientTimeline 
          status={tour.status} 
          tourId={tour.id}
          onStatusChange={onStatusChange}
        />

        <div>
          <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
          <SelectableCollectionPointsList
            points={tour.route}
            selectedPoint={selectedPickupCity || ''}
            onPointSelect={onPickupCitySelect}
            isSelectionEnabled={tour.status === "Programmée"}
            tourDepartureDate={tour.departure_date}
          />
        </div>

        {userType === 'client' && tour.status === "Programmée" && (
          <div>
            <Button 
              onClick={handleBookingClick}
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={!isActionEnabled}
            >
              {actionButtonText}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}