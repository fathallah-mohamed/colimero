import { useNavigate } from "react-router-dom";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";

interface TourDialogsProps {
  showAccessDeniedDialog: boolean;
  setShowAccessDeniedDialog: (show: boolean) => void;
  showApprovalDialog: boolean;
  setShowApprovalDialog: (show: boolean) => void;
  tourId: number;
  pickupCity: string;
  onApprovalSuccess: () => void;
}

export function TourDialogs({
  showAccessDeniedDialog,
  setShowAccessDeniedDialog,
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