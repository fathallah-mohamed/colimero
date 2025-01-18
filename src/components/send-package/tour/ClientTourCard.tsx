import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { CardCustom } from "@/components/ui/card-custom";
import AuthDialog from "@/components/auth/AuthDialog";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourRoute } from "./components/TourRoute";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [showExistingBookingDialog, setShowExistingBookingDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePointSelect = (point: string) => {
    setSelectedPoint(point);
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    const returnPath = sessionStorage.getItem('returnPath');
    if (returnPath) {
      sessionStorage.removeItem('returnPath');
      navigate(returnPath);
    }
  };

  const handleBookingButtonClick = async () => {
    if (!selectedPoint) {
      toast({
        variant: "destructive",
        title: "Point de collecte requis",
        description: "Veuillez sélectionner un point de collecte avant de réserver",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const bookingPath = `/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`;
        sessionStorage.setItem('returnPath', bookingPath);
        setShowAuthDialog(true);
        return;
      }

      const userType = session.user.user_metadata?.user_type;
      
      if (userType === 'carrier') {
        setShowAccessDeniedDialog(true);
        return;
      }

      // Vérifier si l'utilisateur a déjà une réservation pour cette tournée
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('tour_id', tour.id)
        .maybeSingle();

      if (existingBooking) {
        setShowExistingBookingDialog(true);
        return;
      }

      if (!tour.id) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de trouver l'identifiant de la tournée",
        });
        return;
      }

      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`);
    } catch (error) {
      console.error("Error in handleBookingButtonClick:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
      });
    }
  };

  const handleCloseAuthDialog = () => {
    setShowAuthDialog(false);
  };

  return (
    <CardCustom className="bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md">
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <TourMainInfo tour={tour} />
          
          <TourRoute 
            stops={tour.route} 
            onPointSelect={handlePointSelect}
            selectedPoint={selectedPoint}
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
              selectedPoint={selectedPoint}
              onPointSelect={handlePointSelect}
              onBookingClick={handleBookingButtonClick}
              isBookingEnabled={!!selectedPoint}
            />
          )}
        </div>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={handleCloseAuthDialog}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />

      <AccessDeniedMessage
        userType="carrier"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />

      <Dialog open={showExistingBookingDialog} onOpenChange={setShowExistingBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Réservation existante</DialogTitle>
            <DialogDescription>
              Vous avez déjà une réservation pour cette tournée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowExistingBookingDialog(false)}
            >
              Fermer
            </Button>
            <Button 
              onClick={() => {
                setShowExistingBookingDialog(false);
                navigate('/mes-reservations');
              }}
            >
              Voir mes réservations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardCustom>
  );
}