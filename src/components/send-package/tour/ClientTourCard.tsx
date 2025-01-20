import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tour } from "@/types/tour";
import { AnimatePresence } from "framer-motion";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { TourHeader } from "@/components/transporteur/tour/components/TourHeader";
import { TourActions } from "@/components/transporteur/tour/components/TourActions";
import { TourExpandedContent } from "@/components/transporteur/tour/components/TourExpandedContent";

interface ClientTourCardProps {
  tour: Tour;
  onBookingClick?: (tourId: number, pickupCity: string) => void;
  onStatusChange?: (tourId: number, newStatus: string) => Promise<void>;
  hideAvatar?: boolean;
  userType?: string;
  isUpcoming?: boolean;
}

export function ClientTourCard({ 
  tour, 
  onBookingClick,
  onStatusChange,
  hideAvatar, 
  userType,
  isUpcoming = false
}: ClientTourCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);
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
      // Store the return path and redirect to login
      const returnPath = `/envoyer-colis`;
      sessionStorage.setItem('returnPath', returnPath);
      navigate('/connexion');
      return;
    }

    const userType = session.user.user_meta_data?.user_type;
    if (userType === 'carrier') {
      setShowAccessDeniedDialog(true);
      return;
    }

    if (tour.type === 'private') {
      if (existingRequest) {
        toast({
          title: "Demande existante",
          description: `Votre demande est ${existingRequest.status === 'pending' ? 'en attente' : existingRequest.status}`,
        });
        return;
      }
      setShowApprovalDialog(true);
    } else {
      if (onBookingClick) {
        onBookingClick(tour.id, selectedPickupCity);
      } else {
        navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
      }
    }
  };

  const getActionButtonText = () => {
    if (!selectedPickupCity) return "Sélectionnez un point de collecte";
    if (tour.type === 'private') {
      if (existingRequest) {
        switch (existingRequest.status) {
          case 'pending':
            return "Demande en attente d'approbation";
          case 'approved':
            return "Demande approuvée - Réserver";
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

  const isActionEnabled = () => {
    if (!selectedPickupCity) return false;
    if (tour.type === 'private') {
      if (existingRequest) {
        return existingRequest.status === 'approved';
      }
      return true;
    }
    return true;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md">
      <div className="p-6">
        <TourHeader tour={tour} hideAvatar={hideAvatar} isUpcoming={isUpcoming} />
        
        <TourActions 
          isExpanded={isExpanded} 
          onToggle={() => setIsExpanded(!isExpanded)} 
        />

        <AnimatePresence>
          {isExpanded && (
            <TourExpandedContent
              tour={tour}
              selectedPoint={selectedPickupCity || ''}
              onPointSelect={setSelectedPickupCity}
              onActionClick={handleActionClick}
              isActionEnabled={isActionEnabled()}
              actionButtonText={getActionButtonText()}
              userType={userType}
              onStatusChange={onStatusChange}
            />
          )}
        </AnimatePresence>
      </div>

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
    </div>
  );
}