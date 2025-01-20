import { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface TourExpandedContentProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  onActionClick: () => void;
  isActionEnabled: boolean;
  actionButtonText: string;
  hasPendingRequest: boolean;
}

export function TourExpandedContent({
  tour,
  selectedPickupCity,
  onPickupCitySelect,
  onActionClick,
  isActionEnabled,
  actionButtonText,
  hasPendingRequest
}: TourExpandedContentProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBookingClick = () => {
    if (!selectedPickupCity) {
      toast({
        variant: "destructive",
        title: "Point de collecte requis",
        description: "Veuillez sélectionner un point de collecte avant de réserver",
      });
      return;
    }

    navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={handleBookingClick}
          disabled={!selectedPickupCity}
          className="bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white"
        >
          Réserver maintenant
        </Button>
      </div>
    </div>
  );
}