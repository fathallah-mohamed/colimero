import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardCustom } from "@/components/ui/card-custom";
import { useToast } from "@/components/ui/use-toast";
import type { Tour } from "@/types/tour";
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
  const [selectedPoint, setSelectedPoint] = useState("");
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const bookingPath = `/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`;
      sessionStorage.setItem('returnPath', bookingPath);
      navigate('/connexion');
      return;
    }

    // Check user type
    const userType = user.user_metadata?.user_type;
    
    if (userType === 'carrier') {
      setShowAccessDeniedDialog(true);
      return;
    }

    // Vérifier uniquement les réservations en attente
    const { data: pendingBookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
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

    if (pendingBookings) {
      toast({
        variant: "destructive",
        title: "Réservation impossible",
        description: "Vous avez déjà une réservation en attente. Veuillez attendre que votre réservation soit traitée avant d'en effectuer une nouvelle.",
      });
      return;
    }

    navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`);
  };

  return (
    <CardCustom className="bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md">
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <TourMainInfo tour={tour} />
            <div className="flex gap-2 self-start">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/tours/${tour.id}`)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Eye className="h-4 w-4" />
                Consulter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
            </div>
          </div>
          
          <TourRoute 
            stops={tour.route}
            selectedPoint={selectedPoint}
            onPointSelect={setSelectedPoint}
          />

          {isExpanded && (
            <TourExpandedContent
              tour={tour}
              selectedPoint={selectedPoint}
              onPointSelect={setSelectedPoint}
              onActionClick={handleBookingButtonClick}
              isActionEnabled={!!selectedPoint}
              actionButtonText="Réserver"
            />
          )}

          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={handleExpandClick}
              className="text-primary hover:text-primary/90"
            >
              {isExpanded ? "Voir moins" : "Voir plus"}
            </Button>
          </div>
        </div>
      </div>

      <AccessDeniedMessage
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />
    </CardCustom>
  );
}