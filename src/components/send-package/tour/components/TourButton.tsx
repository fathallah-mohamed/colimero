import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { ApprovalRequest } from "@/hooks/approval-requests/types";
import { useNavigate } from "react-router-dom";

interface TourButtonProps {
  tour: Tour;
  existingRequest: ApprovalRequest | null;
  isActionEnabled: boolean;
  onActionClick: () => void;
  selectedPickupCity: string | null;
}

export function TourButton({ 
  tour,
  existingRequest,
  isActionEnabled,
  onActionClick,
  selectedPickupCity
}: TourButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (existingRequest?.status === 'approved') {
      // Si la demande est approuvée, rediriger directement vers le formulaire de réservation
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity || '')}`);
    } else {
      // Sinon, utiliser le comportement normal (demande d'approbation, etc.)
      onActionClick();
    }
  };

  const getButtonStyle = () => {
    if (!isActionEnabled) {
      if (existingRequest?.status === "rejected") {
        return "bg-red-500 hover:bg-red-500 cursor-not-allowed opacity-50";
      }
      if (existingRequest?.status === "pending") {
        return "bg-yellow-500 hover:bg-yellow-500 cursor-not-allowed opacity-50";
      }
    }
    return "bg-[#0FA0CE] hover:bg-[#0FA0CE]/90";
  };

  const getButtonText = () => {
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

  if (tour.status !== "Programmée") {
    return null;
  }

  return (
    <Button 
      onClick={handleClick}
      className={`w-full text-white ${getButtonStyle()}`}
      disabled={!isActionEnabled || (existingRequest?.status === "pending")}
    >
      {getButtonText()}
    </Button>
  );
}