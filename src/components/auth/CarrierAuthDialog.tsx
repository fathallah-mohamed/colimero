import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import CarrierSignupForm from "./CarrierSignupForm";

interface CarrierAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CarrierAuthDialog({ isOpen, onClose }: CarrierAuthDialogProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'h-[95vh] p-4' : 'max-h-[90vh]'} w-full max-w-2xl`}>
        <ScrollArea className="h-full pr-4">
          <div className="pb-6">
            <CarrierSignupForm onSuccess={onClose} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}