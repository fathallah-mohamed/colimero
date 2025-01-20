import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";

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
  onApprovalSuccess,
}: TourDialogsProps) {
  const navigate = useNavigate();

  return (
    <>
      <AccessDeniedMessage
        userType="client"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connexion requise</DialogTitle>
            <DialogDescription>
              Vous devez être connecté pour effectuer cette action.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowAuthDialog(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={() => {
                setShowAuthDialog(false);
                navigate('/login');
              }}
            >
              Se connecter
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