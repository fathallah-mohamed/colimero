import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthDialog from "@/components/auth/AuthDialog";
import { Tour } from "@/types/tour";

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
  const [showAuthDialog, setShowAuthDialog] = useState(false);
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

  const handlePrivateTourAction = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    if (!selectedPoint) {
      toast({
        variant: "destructive",
        title: "Point de ramassage requis",
        description: "Veuillez sélectionner un point de ramassage",
      });
      return;
    }

    // Vérifier uniquement les réservations en attente
    const { data: pendingBooking, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('tour_id', tour.id)
      .eq('status', 'pending')
      .maybeSingle();

    if (error) {
      console.error('Error checking existing bookings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification de vos réservations",
      });
      return;
    }

    if (pendingBooking) {
      toast({
        variant: "destructive",
        title: "Réservation impossible",
        description: "Vous avez déjà une réservation en attente pour cette tournée.",
      });
      return;
    }

    // Si pas de demande existante, créer une nouvelle demande
    if (!approvalStatus) {
      try {
        const { error } = await supabase
          .from('approval_requests')
          .insert({
            user_id: session.user.id,
            tour_id: tour.id,
            status: 'pending',
            pickup_city: selectedPoint
          });

        if (error) throw error;

        setApprovalStatus('pending');
        toast({
          title: "Demande envoyée",
          description: "Votre demande d'approbation a été envoyée au transporteur",
        });
      } catch (error) {
        console.error('Error creating approval request:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi de la demande",
        });
      }
      return;
    }

    // Si approuvé, permettre la réservation
    if (approvalStatus === 'approved') {
      onBookingClick();
    }
  };

  const pickupPoints = tour.route?.filter(stop => 
    stop.type === 'pickup' || stop.type === 'ramassage'
  ) || [];

  const getButtonText = () => {
    if (tour.status !== "Programmée") {
      return "Cette tournée n'est plus disponible pour les réservations";
    }

    if (tour.type === "private") {
      if (!approvalStatus) {
        return !selectedPoint 
          ? "Sélectionnez un point de ramassage pour demander une approbation" 
          : "Demander une approbation";
      }
      
      switch (approvalStatus) {
        case "pending":
          return "Demande d'approbation en cours";
        case "rejected":
          return "Demande d'approbation refusée";
        case "approved":
          return !selectedPoint 
            ? "Sélectionnez un point de ramassage pour réserver" 
            : "Réserver maintenant";
        default:
          return "Demander une approbation";
      }
    }

    return !selectedPoint 
      ? "Sélectionnez un point de ramassage pour réserver" 
      : "Réserver maintenant";
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

  const isActionDisabled = () => {
    if (tour.status !== "Programmée") return true;
    if (tour.type === "private") {
      if (approvalStatus === "pending" || approvalStatus === "rejected") return true;
      if (approvalStatus === "approved" && !selectedPoint) return true;
    }
    return !selectedPoint;
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
        onClick={tour.type === "private" ? handlePrivateTourAction : onBookingClick}
        disabled={isActionDisabled()}
      >
        {getButtonText()}
      </Button>

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          handlePrivateTourAction();
        }}
        requiredUserType="client"
      />
    </div>
  );
}