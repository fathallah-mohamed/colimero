import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface BookingConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  trackingNumber: string;
}

export function BookingConfirmDialog({ open, onClose, trackingNumber }: BookingConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Réservation confirmée
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Votre réservation a été confirmée avec succès. Voici votre numéro de suivi :
          </p>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="font-mono text-lg font-bold">{trackingNumber}</p>
          </div>
          <Button onClick={onClose} className="w-full">
            Compris
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}