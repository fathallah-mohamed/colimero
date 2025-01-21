import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface CarrierAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CarrierAuthDialog({ isOpen, onClose }: CarrierAuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Accès refusé
          </DialogTitle>
          <DialogDescription>
            Les transporteurs ne peuvent pas effectuer de réservations. Seuls les clients peuvent réserver des tournées.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>J'ai compris</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}