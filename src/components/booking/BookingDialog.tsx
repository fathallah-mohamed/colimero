import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: number;
  pickupCity: string;
  destinationCountry: string;
}

export function BookingDialog({
  isOpen,
  onClose,
  tourId,
  pickupCity,
  destinationCountry,
}: BookingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <BookingForm
          tourId={tourId}
          pickupCity={pickupCity}
          destinationCountry={destinationCountry}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}