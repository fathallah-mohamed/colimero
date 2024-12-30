import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <ScrollArea className="h-[90vh] md:h-auto p-6">
          <BookingForm
            tourId={tourId}
            pickupCity={pickupCity}
            destinationCountry={destinationCountry}
            onSuccess={onClose}
            onCancel={onClose}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}