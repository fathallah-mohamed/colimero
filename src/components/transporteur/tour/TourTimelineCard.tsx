import { useState } from "react";
import { TourCardHeader } from "@/components/transporteur/TourCardHeader";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { TourTimeline } from "@/components/transporteur/TourTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import AuthDialog from "@/components/auth/AuthDialog";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { CollectionPointsList } from "@/components/tour/CollectionPointsList";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  hideAvatar?: boolean;
  userType?: string | null;
}

export function TourTimelineCard({ 
  tour, 
  onBookingClick, 
  hideAvatar, 
  userType 
}: TourTimelineCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isBookingEnabled = () => {
    return selectedPickupCity && tour.status === 'planned' && userType !== 'admin';
  };

  const isPickupSelectionEnabled = () => {
    return tour.status === 'planned' && userType !== 'admin';
  };

  const getBookingButtonText = () => {
    if (tour.status === 'cancelled') return "Cette tournée a été annulée";
    if (userType === 'admin') return "Les administrateurs ne peuvent pas effectuer de réservations";
    if (tour.status === 'collecting') return "Cette tournée est en cours de collecte";
    if (tour.status === 'in_transit') return "Cette tournée est en cours de livraison";
    if (tour.status === 'completed') return "Cette tournée est terminée";
    if (!selectedPickupCity) return "Sélectionnez un point de collecte pour réserver";
    return tour.type === 'private' ? "Demander l'approbation" : "Réserver sur cette tournée";
  };

  const handleBookingClick = async () => {
    if (!selectedPickupCity) return;
    
    if (tour.type === 'private') {
      setShowApprovalDialog(true);
    } else {
      onBookingClick(tour.id, selectedPickupCity);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* En-tête toujours visible */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <TourCardHeader tour={tour} hideAvatar={hideAvatar} />
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Contenu dépliable */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-6 pt-0 space-y-6">
          <TourTimeline status={tour.status} />
          
          <TourCapacityDisplay 
            totalCapacity={tour.total_capacity} 
            remainingCapacity={tour.remaining_capacity} 
          />

          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
            <CollectionPointsList
              points={tour.route}
              selectedPoint={selectedPickupCity}
              onPointSelect={setSelectedPickupCity}
              isSelectionEnabled={isPickupSelectionEnabled()}
              tourDepartureDate={tour.departure_date}
            />
          </div>

          <div className="mt-4">
            <Button 
              onClick={handleBookingClick}
              className="w-full"
              disabled={!isBookingEnabled()}
            >
              {getBookingButtonText()}
            </Button>
          </div>
        </div>
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
              onBookingClick(tour.id, selectedPickupCity);
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