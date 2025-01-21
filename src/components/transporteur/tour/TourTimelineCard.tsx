import React, { useState, useEffect } from "react";
import { Tour, TourStatus } from "@/types/tour";
import { AnimatePresence } from "framer-motion";
import AuthDialog from "@/components/auth/AuthDialog";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { TourHeader } from "./components/TourHeader";
import { TourActions } from "./components/TourActions";
import { TourExpandedContent } from "./components/TourExpandedContent";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
  hideAvatar?: boolean;
  userType?: string;
  isUpcoming?: boolean;
}

export function TourTimelineCard({ 
  tour, 
  onBookingClick, 
  onStatusChange,
  hideAvatar, 
  userType,
  isUpcoming = false
}: TourTimelineCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkExistingRequest();
  }, [tour.id]);

  const checkExistingRequest = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: request, error } = await supabase
      .from('approval_requests')
      .select('*')
      .eq('tour_id', tour.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking existing request:', error);
      return;
    }

    setExistingRequest(request);
  };

  const checkExistingBooking = async (userId: string) => {
    // Vérifier s'il existe une réservation en attente pour cette tournée
    const { data: existingBooking, error } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('user_id', userId)
      .eq('tour_id', tour.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking existing bookings:', error);
      return null;
    }

    return existingBooking;
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

    // Vérifier les réservations existantes pour cette tournée
    const existingBooking = await checkExistingBooking(session.user.id);
    if (existingBooking) {
      if (existingBooking.status === 'pending') {
        toast({
          variant: "destructive",
          title: "Réservation impossible",
          description: "Vous avez déjà une réservation en attente pour cette tournée.",
        });
        return;
      }
    }

    // Logique pour les tournées privées
    if (tour.type === 'private') {
      if (existingRequest) {
        switch (existingRequest.status) {
          case 'pending':
            toast({
              variant: "destructive",
              title: "Demande en attente",
              description: "Votre demande d'approbation est en cours de traitement",
            });
            return;
          case 'approved':
            navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
            return;
          case 'rejected':
            toast({
              variant: "destructive",
              title: "Demande rejetée",
              description: "Votre demande d'approbation a été rejetée pour cette tournée",
            });
            return;
        }
      }
      setShowApprovalDialog(true);
    } else {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
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
              selectedPickupCity={selectedPickupCity}
              onPickupCitySelect={setSelectedPickupCity}
              onActionClick={handleActionClick}
              isActionEnabled={isActionEnabled()}
              actionButtonText={getActionButtonText()}
              userType={userType}
              onStatusChange={onStatusChange}
            />
          )}
        </AnimatePresence>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          checkExistingRequest();
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
        onSuccess={() => {
          checkExistingRequest();
          setShowApprovalDialog(false);
        }}
      />
    </div>
  );
}