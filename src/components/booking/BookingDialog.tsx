import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
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
  destinationCountry 
}: BookingDialogProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`
          ${isMobile ? 'h-[95vh] p-4' : 'max-h-[90vh]'} 
          w-full max-w-2xl 
          overflow-hidden
          flex flex-col
        `}
      >
        <ScrollArea 
          className="flex-1 pr-4 overflow-y-auto"
          style={{ 
            height: isMobile ? 'calc(100vh - 5vh)' : 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="pb-20 md:pb-6">
            <BookingForm 
              tourId={tourId}
              pickupCity={pickupCity}
              destinationCountry={destinationCountry}
              onSuccess={onClose}
              onCancel={onClose}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}