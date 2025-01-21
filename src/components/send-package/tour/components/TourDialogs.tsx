import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";

interface TourDialogsProps {
  showExistingBookingDialog: boolean;
  setShowExistingBookingDialog: (show: boolean) => void;
  showPendingApprovalDialog: boolean;
  setShowPendingApprovalDialog: (show: boolean) => void;
  showAccessDeniedDialog: boolean;
  setShowAccessDeniedDialog: (show: boolean) => void;
  showApprovalDialog: boolean;
  setShowApprovalDialog: (show: boolean) => void;
  tourId: number;
  pickupCity: string;
  onApprovalSuccess: () => void;
}

export function TourDialogs({
  showExistingBookingDialog,
  setShowExistingBookingDialog,
  showPendingApprovalDialog,
  setShowPendingApprovalDialog,
  showAccessDeniedDialog,
  setShowAccessDeniedDialog,
  showApprovalDialog,
  setShowApprovalDialog,
  tourId,
  pickupCity,
  onApprovalSuccess,
}: TourDialogsProps) {
  const navigate = useNavigate();

  return (
    <>
      <AccessDeniedMessage
        userType="carrier"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />

      <Dialog open={showExistingBookingDialog} onOpenChange={setShowExistingBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Réservation existante</DialogTitle>
            <DialogDescription>
              Vous avez déjà une réservation en attente pour cette tournée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowExistingBookingDialog(false)}
            >
              Fermer
            </Button>
            <Button 
              onClick={() => {
                setShowExistingBookingDialog(false);
                navigate('/mes-reservations');
              }}
            >
              Voir mes réservations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPendingApprovalDialog} onOpenChange={setShowPendingApprovalDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Demande en attente</DialogTitle>
            <DialogDescription>
              Vous avez déjà une demande d'approbation en attente pour cette tournée. 
              Veuillez attendre la réponse du transporteur avant d'effectuer une nouvelle demande.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              onClick={() => setShowPendingApprovalDialog(false)}
            >
              Compris
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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