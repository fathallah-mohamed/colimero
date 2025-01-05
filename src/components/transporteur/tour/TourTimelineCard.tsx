import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { TourTimeline } from "./TourTimeline";
import { TourStatusBadge } from "./TourStatusBadge";
import { TourActions } from "./TourActions";
import AuthDialog from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/use-auth";
import type { Tour } from "@/types/tour";

export function TourTimelineCard({ tour }: { tour: Tour }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleBookingClick = async (pickupCity: string) => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (user.user_metadata?.user_type === 'carrier') {
      toast({
        variant: "destructive",
        title: "Action non autorisée",
        description: "Les transporteurs ne peuvent pas effectuer de réservations",
      });
      return;
    }

    if (user.user_metadata?.user_type === 'admin') {
      toast({
        variant: "destructive",
        title: "Action non autorisée",
        description: "Les administrateurs ne peuvent pas effectuer de réservations",
      });
      return;
    }

    navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(pickupCity)}`);
  };

  const handleAuthSuccess = () => {
    setIsAuthDialogOpen(false);
    toast({
      title: "Connexion réussie",
      description: "Vous pouvez maintenant effectuer votre réservation",
    });
  };

  const isBookingEnabled = (status: string) => {
    return status === 'collecting';
  };

  const getBookingButtonText = (status: string) => {
    switch (status) {
      case 'planned':
        return "Cette tournée n'est pas encore ouverte aux réservations";
      case 'collecting':
        return "Réserver sur cette tournée";
      case 'in_transit':
        return "Cette tournée est en cours de livraison";
      case 'completed':
        return "Cette tournée est terminée";
      case 'cancelled':
        return "Cette tournée a été annulée";
      default:
        return "Statut inconnu";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">
            Tournée {tour.id}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {tour.type === 'public' ? 'Publique' : 'Privée'}
            </Badge>
            <TourStatusBadge status={tour.status} />
          </div>
        </div>
        <TourActions tour={tour} />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Date de départ</p>
          <p className="font-medium">
            {formatDate(tour.departure_date)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Itinéraire</p>
          <TourTimeline
            route={tour.route}
            onBookingClick={(city) => handleBookingClick(city)}
            isBookingEnabled={isBookingEnabled(tour.status)}
            bookingButtonText={getBookingButtonText(tour.status)}
          />
        </div>
      </div>

      <AuthDialog
        open={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />
    </Card>
  );
}