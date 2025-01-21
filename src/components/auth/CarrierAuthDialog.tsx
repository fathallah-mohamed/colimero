import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertOctagon } from "lucide-react";

interface CarrierAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CarrierAuthDialog({ isOpen, onClose }: CarrierAuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <AlertOctagon className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold">Accès refusé</h2>
          <p className="text-gray-600">
            Les transporteurs ne peuvent pas effectuer de réservations. Seuls les clients peuvent réserver des tournées.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}