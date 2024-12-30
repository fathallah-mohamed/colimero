import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import CarrierSignupForm from "./CarrierSignupForm";

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
          fixed inset-0 
          ${isMobile ? 'min-h-screen p-4' : 'max-h-[90vh] relative'} 
          w-full max-w-2xl mx-auto
          overflow-hidden
          flex flex-col
          bg-background
        `}
      >
        <ScrollArea 
          className="flex-1 pr-4"
          style={{ 
            height: isMobile ? 'calc(100vh - 120px)' : 'auto',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          <div className="pb-40 md:pb-6">
            <CarrierSignupForm onSuccess={onClose} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}