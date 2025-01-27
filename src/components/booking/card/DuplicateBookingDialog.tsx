import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface DuplicateBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DuplicateBookingDialog({
  isOpen,
  onClose,
}: DuplicateBookingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Action impossible
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Il existe déjà une réservation en attente pour ce client sur cette tournée. 
            Il n'est pas possible d'avoir plusieurs réservations en attente pour le même client.
          </p>
          <Button onClick={onClose} className="w-full">
            J'ai compris
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}