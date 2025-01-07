import React, { useState } from "react";
import { TourCardHeader } from "@/components/transporteur/TourCardHeader";
import { Button } from "@/components/ui/button";
import { Tour, TourStatus } from "@/types/tour";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import AuthDialog from "@/components/auth/AuthDialog";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
  hideAvatar?: boolean;
  userType?: string;
  isUpcoming?: boolean;
}

export function TourTimelineCard({ 
  tour, 
  onBookingClick, 
  onStatusChange,
  hideAvatar, 
  userType,
  isUpcoming = false
}: TourTimelineCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const isBookingEnabled = () => {
    return selectedPickupCity && tour.status === "Programmé" && userType !== 'admin';
  };

  const isPickupSelectionEnabled = () => {
    return tour.status === "Programmé" && userType !== 'admin';
  };

  const getBookingButtonText = () => {
    if (tour.status === "Annulée") return "Cette tournée a été annulée";
    if (userType === 'admin') return "Les administrateurs ne peuvent pas effectuer de réservations";
    if (tour.status === "Ramassage terminé") return "Cette tournée est en cours de collecte";
    if (tour.status === "Transport terminé") return "Cette tournée est en cours de livraison";
    if (tour.status === "Livraison terminée") return "Cette tournée est terminée";
    if (!selectedPickupCity) return "Sélectionnez un point de collecte pour réserver";
    return tour.type === 'private' ? "Demander l'approbation" : "Réserver sur cette tournée";
  };

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
    <div className="bg-white rounded-xl overflow-hidden transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <TourCardHeader tour={tour} hideAvatar={hideAvatar} />
          {isUpcoming && (
            <Badge className="bg-success/10 text-success hover:bg-success/20 transition-colors">
              Prochaine tournée
            </Badge>
          )}
        </div>

        <div 
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto transition-colors duration-200 hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
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

        <AnimatePresence>
          {isExpanded && (
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
                />
                
                <TourCapacityDisplay 
                  totalCapacity={tour.total_capacity} 
                  remainingCapacity={tour.remaining_capacity} 
                />

                <div>
                  <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
                  <SelectableCollectionPointsList
                    points={tour.route}
                    selectedPoint={selectedPickupCity || ''}
                    onPointSelect={setSelectedPickupCity}
                    isSelectionEnabled={isPickupSelectionEnabled()}
                    tourDepartureDate={tour.departure_date}
                  />
                </div>

                <div>
                  <Button 
                    onClick={handleBookingClick}
                    className="w-full"
                    disabled={!isBookingEnabled()}
                  >
                    {getBookingButtonText()}
                  </Button>
                </div>
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
    </div>
  );
}
