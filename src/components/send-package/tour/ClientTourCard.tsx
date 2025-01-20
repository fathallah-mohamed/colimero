import { useState } from "react";
import { Tour } from "@/types/tour";
import { Badge } from "@/components/ui/badge";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourRoute } from "./components/TourRoute";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { TourDialogs } from "./components/TourDialogs";
import { useApprovalRequest } from "./hooks/useApprovalRequest";
import { useTourActions } from "./hooks/useTourActions";
import { CardCustom } from "@/components/ui/card-custom";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { existingRequest, checkExistingRequest } = useApprovalRequest(tour.id);
  
  const {
    showAuthDialog,
    setShowAuthDialog,
    showApprovalDialog,
    setShowApprovalDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    handleActionClick,
    getActionButtonText,
    isActionEnabled
  } = useTourActions(tour, selectedPickupCity, existingRequest);

  const handleApprovalSuccess = () => {
    setShowApprovalDialog(false);
    checkExistingRequest();
  };

  return (
    <CardCustom className="bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md">
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <TourMainInfo tour={tour} />
          
          <TourRoute 
            stops={tour.route} 
            onPointSelect={setSelectedPickupCity}
            selectedPoint={selectedPickupCity}
          />

          {isExpanded && (
            <TourExpandedContent 
              tour={tour}
              selectedPickupCity={selectedPickupCity}
              onPickupCitySelect={setSelectedPickupCity}
              onActionClick={handleActionClick}
              isActionEnabled={isActionEnabled()}
              actionButtonText={getActionButtonText()}
              hasPendingRequest={existingRequest?.status === 'pending'}
            />
          )}
        </div>
      </div>

      <TourDialogs
        showAccessDeniedDialog={showAccessDeniedDialog}
        setShowAccessDeniedDialog={setShowAccessDeniedDialog}
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        showApprovalDialog={showApprovalDialog}
        setShowApprovalDialog={setShowApprovalDialog}
        tourId={tour.id}
        pickupCity={selectedPickupCity || ''}
        onApprovalSuccess={handleApprovalSuccess}
      />
    </CardCustom>
  );
}