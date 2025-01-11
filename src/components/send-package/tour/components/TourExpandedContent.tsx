import { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TourExpandedContentProps {
  tour: Tour;
  selectedPoint: string;
  onPointSelect: (point: string) => void;
  onBookingClick: () => void;
  isBookingEnabled: boolean;
}

export function TourExpandedContent({ 
  tour, 
  selectedPoint, 
  onPointSelect,
  onBookingClick,
  isBookingEnabled
}: TourExpandedContentProps) {
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (tour.type === 'private') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: approvalRequest } = await supabase
            .from('approval_requests')
            .select('status')
            .eq('tour_id', tour.id)
            .eq('user_id', session.user.id)
            .single();

          setApprovalStatus(approvalRequest?.status || null);
        }
      }
      setIsLoading(false);
    };

    checkApprovalStatus();
  }, [tour.id, tour.type]);

  const pickupPoints = tour.route?.filter(stop => 
    stop.type === 'pickup' || stop.type === 'ramassage'
  ) || [];

  const getBookingButtonText = () => {
    if (tour.status === "Annulée") return "Cette tournée a été annulée";
    if (tour.status !== "Programmée") return "Cette tournée n'est plus disponible pour les réservations";
    
    if (tour.type === "private") {
      if (approvalStatus === "pending") return "Demande d'approbation en cours";
      if (approvalStatus === "rejected") return "Demande d'approbation refusée";
      if (approvalStatus === "approved") {
        return !selectedPoint 
          ? "Sélectionnez un point de ramassage pour réserver" 
          : "Réserver maintenant";
      }
      return !selectedPoint 
        ? "Sélectionnez un point de ramassage pour demander une approbation" 
        : "Demander une approbation";
    }

    return !selectedPoint 
      ? "Sélectionnez un point de ramassage pour réserver" 
      : "Réserver maintenant";
  };

  const isActionDisabled = () => {
    if (tour.status !== "Programmée") return true;
    if (tour.type === "private" && approvalStatus === "pending") return true;
    if (!selectedPoint) return true;
    return false;
  };

  const getButtonStyle = () => {
    if (tour.type === "private") {
      if (approvalStatus === "pending") return "bg-gray-500 hover:bg-gray-600";
      if (approvalStatus === "rejected") return "bg-red-600 hover:bg-red-700";
      if (approvalStatus === "approved") return "bg-green-600 hover:bg-green-700";
      return "bg-purple-600 hover:bg-purple-700";
    }
    return "bg-blue-600 hover:bg-blue-700";
  };

  return (
    <div className="mt-6 space-y-6 animate-in slide-in-from-top-4 duration-200">
      <ClientTimeline 
        status={tour.status} 
        tourId={tour.id}
      />

      <TourCapacityDisplay 
        totalCapacity={tour.total_capacity} 
        remainingCapacity={tour.remaining_capacity} 
      />
      
      <SelectableCollectionPointsList
        points={pickupPoints}
        selectedPoint={selectedPoint}
        onPointSelect={onPointSelect}
        isSelectionEnabled={tour.status === "Programmée"}
        tourDepartureDate={tour.departure_date}
      />

      <Button 
        className={`w-full transition-colors ${getButtonStyle()} text-white`}
        onClick={onBookingClick}
        disabled={isActionDisabled()}
      >
        {getBookingButtonText()}
      </Button>
    </div>
  );
}