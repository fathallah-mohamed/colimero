import { useState } from "react";
import { Tour } from "@/types/tour";
import { useToast } from "@/hooks/use-toast";
import { CardCustom } from "@/components/ui/card-custom";
import { Button } from "@/components/ui/button";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourRoute } from "./components/TourRoute";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { TourDialogs } from "./components/TourDialogs";
import { useTourBooking } from "./hooks/useTourBooking";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPickupCity, setSelectedPickupCity] = useState<string>("");
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const { toast } = useToast();

  const {
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    showExistingBookingDialog,
    setShowExistingBookingDialog,
    showPendingApprovalDialog,
    setShowPendingApprovalDialog,
    showApprovalDialog,
    setShowApprovalDialog,
    handleBookingButtonClick,
  } = useTourBooking(tour);

  const handlePickupCitySelect = (city: string) => {
    setSelectedPickupCity(city);
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleApprovalRequestSuccess = () => {
    setShowApprovalDialog(false);
    setHasPendingRequest(true);
    toast({
      title: "Demande envoyée",
      description: "Votre demande d'approbation a été envoyée avec succès",
    });
  };

  return (
    <CardCustom className="bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md">
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <TourMainInfo tour={tour} />
          
          <TourRoute 
            stops={tour.route} 
            onPointSelect={handlePickupCitySelect}
            selectedPoint={selectedPickupCity}
          />

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleExpandClick}
              className="text-gray-600 hover:bg-primary/10"
            >
              {isExpanded ? "Voir moins" : "Voir les détails de la tournée"}
            </Button>
          </div>

          {isExpanded && (
            <TourExpandedContent 
              tour={tour}
              selectedPickupCity={selectedPickupCity}
              onPickupCitySelect={handlePickupCitySelect}
              onActionClick={() => handleBookingButtonClick(selectedPickupCity)}
              isActionEnabled={!!selectedPickupCity && !hasPendingRequest}
              actionButtonText={tour.type === 'private' ? "Demander une approbation" : "Réserver cette tournée"}
              hasPendingRequest={hasPendingRequest}
            />
          )}
        </div>
      </div>

      <TourDialogs
        showAccessDeniedDialog={showAccessDeniedDialog}
        setShowAccessDeniedDialog={setShowAccessDeniedDialog}
        showExistingBookingDialog={showExistingBookingDialog}
        setShowExistingBookingDialog={setShowExistingBookingDialog}
        showPendingApprovalDialog={showPendingApprovalDialog}
        setShowPendingApprovalDialog={setShowPendingApprovalDialog}
        showApprovalDialog={showApprovalDialog}
        setShowApprovalDialog={setShowApprovalDialog}
        tourId={tour.id}
        pickupCity={selectedPickupCity}
        onApprovalSuccess={handleApprovalRequestSuccess}
      />
    </CardCustom>
  );
}