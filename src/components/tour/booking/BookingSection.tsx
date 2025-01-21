import { Tour } from "@/types/tour";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { BookingButton } from "./BookingButton";
import { useBookingButton } from "@/hooks/useBookingButton";
import AuthDialog from "@/components/auth/AuthDialog";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";

interface BookingSectionProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  existingRequest?: any;
  userType?: string;
}

export function BookingSection({
  tour,
  selectedPickupCity,
  onPickupCitySelect,
  existingRequest,
  userType
}: BookingSectionProps) {
  const {
    showAuthDialog,
    setShowAuthDialog,
    showApprovalDialog,
    setShowApprovalDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    isActionEnabled,
    handleBookingClick
  } = useBookingButton(tour);

  return (
    <div className="space-y-6">
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
        <BookingButton
          tour={tour}
          selectedPickupCity={selectedPickupCity}
          existingRequest={existingRequest}
          isEnabled={isActionEnabled(selectedPickupCity, existingRequest)}
          onClick={() => selectedPickupCity && handleBookingClick(selectedPickupCity)}
        />
      )}

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          if (selectedPickupCity) {
            if (tour.type === 'private') {
              setShowApprovalDialog(true);
            } else {
              handleBookingClick(selectedPickupCity);
            }
          }
        }}
        requiredUserType="client"
      />

      <AccessDeniedMessage
        userType="carrier"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
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