import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { CardCustom } from "@/components/ui/card-custom";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourRoute } from "./components/TourRoute";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { Share2, Eye } from "lucide-react";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePointSelect = (point: string) => {
    setSelectedPoint(point);
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleShare = async () => {
    const tourUrl = `${window.location.origin}/tours/${tour.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Partager la tournée',
          text: 'Consultez cette tournée',
          url: tourUrl,
        });
      } else {
        await navigator.clipboard.writeText(tourUrl);
        toast({
          title: "Lien copié !",
          description: "Le lien de la tournée a été copié dans votre presse-papiers",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de partager la tournée",
        });
      }
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
        navigate('/connexion');
        return;
      }

      const userType = session.user.user_metadata?.user_type;
      
      if (userType === 'carrier') {
        setShowAccessDeniedDialog(true);
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
          title: "Réservation existante",
          description: "Vous avez déjà une réservation en attente pour cette tournée",
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

  return (
    <CardCustom className="bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md">
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <TourMainInfo tour={tour} />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/tours/${tour.id}`)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Consulter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
            </div>
          </div>
          
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
              onActionClick={handleBookingButtonClick}
              isActionEnabled={!!selectedPoint}
              actionButtonText={tour.type === 'private' ? "Demander l'approbation" : "Réserver cette tournée"}
            />
          )}
        </div>
      </div>

      <AccessDeniedMessage
        userType="carrier"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />
    </CardCustom>
  );
}