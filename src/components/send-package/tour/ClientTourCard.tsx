import { useState, useEffect } from "react";
import { Tour } from "@/types/tour";
import { useToast } from "@/hooks/use-toast";
import { CardCustom } from "@/components/ui/card-custom";
import { Button } from "@/components/ui/button";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourRoute } from "./components/TourRoute";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { TourDialogs } from "./components/TourDialogs";
import { useTourBooking } from "./hooks/useTourBooking";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPickupCity, setSelectedPickupCity] = useState<string>("");
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    showExistingBookingDialog,
    setShowExistingBookingDialog,
    showPendingApprovalDialog,
    setShowPendingApprovalDialog,
    showApprovalDialog,
    setShowApprovalDialog,
    handleBookingButtonClick,
  } = useTourBooking(tour);

  useEffect(() => {
    checkExistingRequest();
  }, [tour.id]);

  const checkExistingRequest = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: request, error } = await supabase
      .from('approval_requests')
      .select('*')
      .eq('tour_id', tour.id)
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking existing request:', error);
      return;
    }

    console.log('Existing request found:', request);
    setExistingRequest(request);
    if (request?.status === 'pending') {
      setHasPendingRequest(true);
    }
  };

  const handlePickupCitySelect = (city: string) => {
    setSelectedPickupCity(city);
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleApprovalRequestSuccess = () => {
    setShowApprovalDialog(false);
    setHasPendingRequest(true);
    toast({
      title: "Demande envoyée",
      description: "Votre demande d'approbation a été envoyée avec succès",
    });
    checkExistingRequest();
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
      setShowAccessDeniedDialog(true);
      return;
    }

    // Si c'est une tournée privée, vérifier l'état de la demande d'approbation
    if (tour.type === 'private') {
      if (existingRequest) {
        if (existingRequest.status === 'approved') {
          // Si la demande est approuvée, rediriger vers le formulaire de réservation
          navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
        } else if (existingRequest.status === 'pending') {
          toast({
            title: "Demande en attente",
            description: "Votre demande d'approbation est en cours de traitement",
          });
        } else if (existingRequest.status === 'rejected') {
          toast({
            title: "Demande rejetée",
            description: "Votre demande d'approbation a été rejetée",
          });
        }
      } else {
        setShowApprovalDialog(true);
      }
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
    <CardCustom className="bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md">
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <TourMainInfo tour={tour} />
          
          <TourRoute 
            stops={tour.route} 
            onPointSelect={handlePickupCitySelect}
            selectedPoint={selectedPickupCity}
          />

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleExpandClick}
              className="text-gray-600 hover:bg-primary/10"
            >
              {isExpanded ? "Voir moins" : "Voir les détails de la tournée"}
            </Button>
          </div>

          {isExpanded && (
            <TourExpandedContent 
              tour={tour}
              selectedPickupCity={selectedPickupCity}
              onPickupCitySelect={handlePickupCitySelect}
              onActionClick={handleActionClick}
              isActionEnabled={isActionEnabled()}
              actionButtonText={getActionButtonText()}
              hasPendingRequest={hasPendingRequest}
            />
          )}
        </div>
      </div>

      <TourDialogs
        showAccessDeniedDialog={showAccessDeniedDialog}
        setShowAccessDeniedDialog={setShowAccessDeniedDialog}
        showExistingBookingDialog={showExistingBookingDialog}
        setShowExistingBookingDialog={setShowExistingBookingDialog}
        showPendingApprovalDialog={showPendingApprovalDialog}
        setShowPendingApprovalDialog={setShowPendingApprovalDialog}
        showApprovalDialog={showApprovalDialog}
        setShowApprovalDialog={setShowApprovalDialog}
        tourId={tour.id}
        pickupCity={selectedPickupCity}
        onApprovalSuccess={handleApprovalRequestSuccess}
      />
    </CardCustom>
  );
}