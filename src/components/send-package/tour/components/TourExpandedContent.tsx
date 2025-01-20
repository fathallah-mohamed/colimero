import { Tour, TourStatus } from "@/types/tour";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import AuthDialog from "@/components/auth/AuthDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";

interface TourExpandedContentProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  onActionClick: () => void;
  isActionEnabled: boolean;
  actionButtonText: string;
  userType?: string;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
}

export function TourExpandedContent({
  tour,
  selectedPickupCity,
  onPickupCitySelect,
  userType,
  onStatusChange
}: TourExpandedContentProps) {
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (tour.type === 'private') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          try {
            const { data: approvalRequest, error } = await supabase
              .from('approval_requests')
              .select('status')
              .eq('tour_id', tour.id)
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (error) {
              console.error('Error checking approval status:', error);
              return;
            }

            setApprovalStatus(approvalRequest?.status || null);
          } catch (error) {
            console.error('Error checking approval status:', error);
          }
        }
      }
      setIsLoading(false);
    };

    checkApprovalStatus();
  }, [tour.id, tour.type]);

  const getActionButtonText = () => {
    if (!selectedPickupCity) {
      return "Sélectionnez un point de collecte";
    }
    
    if (tour.type === 'private') {
      if (approvalStatus === 'pending') {
        return "Demande d'approbation en attente";
      } else if (approvalStatus === 'approved') {
        return "Réserver maintenant";
      } else if (approvalStatus === 'rejected') {
        return "Demande rejetée";
      }
      return "Demander l'approbation";
    }
    
    return "Réserver maintenant";
  };

  const isActionEnabled = () => {
    if (!selectedPickupCity) return false;
    if (tour.type === 'private') {
      if (approvalStatus === 'pending') return false;
      return approvalStatus === 'approved' || !approvalStatus;
    }
    return true;
  };

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
      setShowAuthDialog(true);
      return;
    }

    const userType = session.user.user_metadata?.user_type;
    if (userType === 'carrier') {
      setShowAccessDeniedDialog(true);
      return;
    }

    if (tour.type === 'private') {
      if (approvalStatus === 'approved') {
        navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
      } else if (approvalStatus === 'pending') {
        toast({
          title: "Demande en attente",
          description: "Vous avez déjà une demande d'approbation en attente pour cette tournée",
        });
      } else {
        setShowApprovalDialog(true);
      }
    } else {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
    }
  };

  const pickupPoints = tour.route?.filter(stop => 
    stop.type === 'pickup' || stop.type === 'ramassage'
  ) || [];

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="pt-6 space-y-6"
    >
      <ClientTimeline 
        status={tour.status} 
        tourId={tour.id}
      />

      <div>
        <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
        <SelectableCollectionPointsList
          points={pickupPoints}
          selectedPoint={selectedPickupCity || ''}
          onPointSelect={onPickupCitySelect}
          isSelectionEnabled={tour.status === "Programmée"}
          tourDepartureDate={tour.departure_date}
        />
      </div>

      {userType === 'client' && tour.status === "Programmée" && (
        <div>
          <Button 
            onClick={handleActionClick}
            className="w-full bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white"
            disabled={!isActionEnabled() || isLoading || approvalStatus === 'pending'}
          >
            {getActionButtonText()}
          </Button>
        </div>
      )}

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          handleActionClick();
        }}
        requiredUserType="client"
      />

      <AccessDeniedMessage
        userType="carrier"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />

      <ApprovalRequestDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        tourId={tour.id}
        pickupCity={selectedPickupCity || ''}
      />
    </motion.div>
  );
}