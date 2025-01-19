import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface BookingConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  trackingNumber: string;
}

export function BookingConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  trackingNumber,
}: BookingConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Réservation confirmée
          </DialogTitle>
          <DialogDescription>
            Votre réservation a été créée avec succès. Votre numéro de suivi est : {trackingNumber}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={onConfirm}
            className="w-full"
          >
            J'ai compris
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}