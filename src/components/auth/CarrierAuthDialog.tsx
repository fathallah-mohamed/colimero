import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { CarrierSignupForm } from "./CarrierSignupForm";
import { Heading } from "@/components/ui/heading";

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
            <div className="text-center mb-6">
              <Heading level={2} className="mb-2">
                Créer un compte transporteur
              </Heading>
              <p className="text-gray-600">
                Créez un compte transporteur pour commencer à créer des tournées et accéder à notre réseau d'expéditeurs
              </p>
            </div>
            <CarrierSignupForm onSuccess={onClose} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}