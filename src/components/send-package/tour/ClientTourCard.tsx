import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tour } from "@/types/tour";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
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
      setShowAccessDeniedDialog(true);
      return;
    }

    navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
  };

  const getActionButtonText = () => {
    if (!selectedPickupCity) return "Sélectionnez un point de collecte";
    return "Réserver maintenant";
  };

  const isActionEnabled = () => {
    return !!selectedPickupCity;
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <TourMainInfo
        tour={tour}
        isExpanded={isExpanded}
        onExpandClick={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <TourExpandedContent
          tour={tour}
          selectedPickupCity={selectedPickupCity || ''}
          onPickupCitySelect={setSelectedPickupCity}
          onActionClick={handleActionClick}
          isActionEnabled={isActionEnabled()}
          actionButtonText={getActionButtonText()}
          hasPendingRequest={false}
        />
      )}

      <AccessDeniedMessage
        userType="carrier"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />
    </Card>
  );
}