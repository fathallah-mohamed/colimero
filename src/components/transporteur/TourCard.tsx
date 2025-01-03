import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { TourCardHeader } from "./TourCardHeader";
import { TourCollectionPoints } from "./TourCollectionPoints";
import { TourCapacityDisplay } from "./TourCapacityDisplay";
import { supabase } from "@/integrations/supabase/client";

interface TourCardProps {
  tour: any;
  hideAvatar?: boolean;
  onBookingClick?: (tourId: number, pickupCity: string) => void;
}

export function TourCard({ tour, hideAvatar = false, onBookingClick }: TourCardProps) {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const { toast } = useToast();

  const handleRequestApproval = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour faire une demande d'approbation",
        variant: "destructive"
      });
      return;
    }
    setShowApprovalDialog(true);
  };

  const handleBookingClick = (pickupCity: string) => {
    if (onBookingClick) {
      onBookingClick(tour.id, pickupCity);
    } else {
      window.location.href = `/reserver/${tour.id}`;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <TourCardHeader tour={tour} hideAvatar={hideAvatar} />
      <TourCollectionPoints 
        route={tour.route} 
        onPointSelect={() => {}} 
      />
      <TourCapacityDisplay 
        totalCapacity={tour.total_capacity} 
        remainingCapacity={tour.remaining_capacity} 
      />
      
      <div className="mt-6">
        {tour.type === 'private' ? (
          <Button 
            onClick={handleRequestApproval}
            className="w-full"
          >
            Demander l'approbation
          </Button>
        ) : (
          <Button 
            onClick={() => handleBookingClick(tour.route?.[0]?.name || '')}
            className="w-full"
          >
            Réserver
          </Button>
        )}
      </div>

      <ApprovalRequestDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        tourId={tour.id}
        pickupCity={tour.route?.[0]?.name || ''}
      />
    </div>
  );
}