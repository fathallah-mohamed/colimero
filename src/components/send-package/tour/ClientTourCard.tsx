import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tour } from "@/types/tour";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { supabase } from "@/integrations/supabase/client";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleActionClick = async () => {
    if (!selectedPickupCity) {
      toast({
        variant: "destructive",
        title: "Point de collecte requis",
        description: "Veuillez sélectionner un point de collecte",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      const returnPath = `/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`;
      sessionStorage.setItem('returnPath', returnPath);
      navigate('/connexion');
      return;
    }

    const userType = session.user.user_metadata?.user_type;
    if (userType === 'carrier') {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Les transporteurs ne peuvent pas effectuer de réservations",
      });
      return;
    }

    if (tour.type === 'private') {
      setShowApprovalDialog(true);
    } else {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
    }
  };

  const getActionButtonText = () => {
    if (!selectedPickupCity) return "Sélectionnez un point de collecte";
    return tour.type === 'private' ? "Demander l'approbation" : "Réserver maintenant";
  };

  const isActionEnabled = () => {
    return !!selectedPickupCity;
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        <TourMainInfo 
          tour={tour} 
          isExpanded={isExpanded}
          onExpandClick={() => setIsExpanded(!isExpanded)}
        />

        {isExpanded && (
          <TourExpandedContent
            tour={tour}
            selectedPickupCity={selectedPickupCity}
            onPickupCitySelect={setSelectedPickupCity}
            onActionClick={handleActionClick}
            isActionEnabled={isActionEnabled()}
            actionButtonText={getActionButtonText()}
            hasPendingRequest={false}
          />
        )}

        {showApprovalDialog && (
          <ApprovalRequestDialog
            isOpen={showApprovalDialog}
            onClose={() => setShowApprovalDialog(false)}
            tourId={tour.id}
            pickupCity={selectedPickupCity}
            onSuccess={() => {
              toast({
                title: "Demande envoyée",
                description: "Votre demande d'approbation a été envoyée avec succès",
              });
            }}
          />
        )}
      </div>
    </Card>
  );
}