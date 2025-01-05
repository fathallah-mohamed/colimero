import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import CarrierSignupForm from "./carrier-signup/CarrierSignupForm";

interface CarrierAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CarrierAuthDialog({ isOpen, onClose }: CarrierAuthDialogProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`
          ${isMobile ? 'h-[95vh] p-4' : 'max-h-[90vh]'} 
          w-full max-w-4xl 
          overflow-hidden
          flex flex-col
        `}
      >
        <ScrollArea 
          className="flex-1 overflow-y-auto"
          style={{ 
            height: isMobile ? 'calc(100vh - 5vh)' : 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="pb-20 md:pb-6">
            <CarrierSignupForm onSuccess={onClose} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
