import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";

interface BookingButtonProps {
  tour: Tour;
  selectedPickupCity: string | null;
  existingRequest?: any;
  isEnabled: boolean;
  onClick: () => void;
}

export function BookingButton({
  tour,
  selectedPickupCity,
  existingRequest,
  isEnabled,
  onClick
}: BookingButtonProps) {
  const getButtonText = () => {
    if (!selectedPickupCity) return "Sélectionnez un point de collecte";
    if (tour.status !== "Programmée") return `Cette tournée est en statut "${tour.status}"`;
    
    if (tour.type === 'private') {
      if (existingRequest) {
        switch (existingRequest.status) {
          case 'pending':
            return "Demande en attente d'approbation";
          case 'approved':
            return "Réserver maintenant";
          case 'rejected':
            return "Demande rejetée";
          default:
            return "Demander l'approbation";
        }
      }
      return "Demander l'approbation";
    }
    return "Réserver maintenant";
  };

  return (
    <Button 
      onClick={onClick}
      className="w-full bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white"
      disabled={!isEnabled}
    >
      {getButtonText()}
    </Button>
  );
}