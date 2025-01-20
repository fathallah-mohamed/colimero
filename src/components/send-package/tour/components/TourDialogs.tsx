import { useNavigate } from "react-router-dom";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import AuthDialog from "@/components/auth/AuthDialog";

interface TourDialogsProps {
  showAccessDeniedDialog: boolean;
  setShowAccessDeniedDialog: (show: boolean) => void;
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
  showApprovalDialog: boolean;
  setShowApprovalDialog: (show: boolean) => void;
  tourId: number;
  pickupCity: string;
  onApprovalSuccess: () => void;
}

export function TourDialogs({
  showAccessDeniedDialog,
  setShowAccessDeniedDialog,
  showAuthDialog,
  setShowAuthDialog,
  showApprovalDialog,
  setShowApprovalDialog,
  tourId,
  pickupCity,
  onApprovalSuccess
}: TourDialogsProps) {
  const navigate = useNavigate();

  return (
    <>
      <AccessDeniedMessage
        userType="carrier"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          if (pickupCity) {
            setShowApprovalDialog(true);
          }
        }}
        requiredUserType="client"
      />

      <ApprovalRequestDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        tourId={tourId}
        pickupCity={pickupCity}
        onSuccess={onApprovalSuccess}
      />
    </>
  );
}