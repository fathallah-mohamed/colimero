import { useState } from "react";
import { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourRoute } from "./components/TourRoute";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { TourDialogs } from "./components/TourDialogs";
import { useApprovalRequest } from "./hooks/useApprovalRequest";
import { useTourActions } from "./hooks/useTourActions";
import { CardCustom } from "@/components/ui/card-custom";
import { useNavigate } from "react-router-dom";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const navigate = useNavigate();
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

  const handleBookingClick = () => {
    if (selectedPickupCity) {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
    }
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
              onActionClick={handleBookingClick}
              isActionEnabled={isActionEnabled()}
              actionButtonText={getActionButtonText()}
              hasPendingRequest={existingRequest?.status === 'pending'}
            />
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full text-[#0FA0CE] hover:text-[#0FA0CE] hover:bg-[#0FA0CE]/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isExpanded ? "Masquer les détails" : "Afficher les détails"}
          </Button>
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