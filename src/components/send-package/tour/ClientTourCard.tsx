import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tour } from "@/types/tour";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [showCarrierErrorDialog, setShowCarrierErrorDialog] = useState(false);
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
      setShowCarrierErrorDialog(true);
      return;
    }

    if (tour.type === 'private') {
      if (existingRequest) {
        switch (existingRequest.status) {
          case 'pending':
            setShowPendingDialog(true);
            return;
          case 'approved':
            navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
            return;
          case 'rejected':
            return; // Le bouton sera désactivé
          default:
            setShowApprovalDialog(true);
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
        if (existingRequest.status === 'rejected') return false;
        if (existingRequest.status === 'pending') return false;
        return existingRequest.status === 'approved';
      }
      return true;
    }
    return true;
  };

  const hasPendingRequest = existingRequest?.status === 'pending';

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
            hasPendingRequest={hasPendingRequest}
          />
        )}

        {showApprovalDialog && (
          <ApprovalRequestDialog
            isOpen={showApprovalDialog}
            onClose={() => setShowApprovalDialog(false)}
            tourId={tour.id}
            pickupCity={selectedPickupCity}
            onSuccess={() => {
              checkExistingRequest();
              setShowApprovalDialog(false);
              toast({
                title: "Demande envoyée",
                description: "Votre demande d'approbation a été envoyée avec succès",
              });
            }}
          />
        )}

        <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                Demande en attente
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Vous avez déjà une demande d'approbation en attente pour cette tournée. 
                Veuillez attendre la réponse du transporteur avant de faire une nouvelle demande.
              </p>
              <Button onClick={() => setShowPendingDialog(false)} className="w-full">
                Compris
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCarrierErrorDialog} onOpenChange={setShowCarrierErrorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Accès refusé
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Les transporteurs ne peuvent pas effectuer de réservations. Seuls les clients peuvent réserver des tournées.
              </p>
              <Button onClick={() => setShowCarrierErrorDialog(false)} className="w-full">
                J'ai compris
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}