import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick?: (tourId: number, pickupCity: string) => Promise<void> | void;
  hideAvatar?: boolean;
  userType?: string;
  isUpcoming?: boolean;
}

export function TourTimelineCard({ 
  tour, 
  onBookingClick,
  hideAvatar = false,
  userType,
  isUpcoming = false 
}: TourTimelineCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleBookingClick = () => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }

    const pickupCity = tour.route[0]?.name || '';
    
    if (onBookingClick) {
      onBookingClick(tour.id, pickupCity);
    } else {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(pickupCity)}`);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthDialogOpen(false);
    toast({
      title: "Connexion réussie",
      description: "Vous pouvez maintenant effectuer votre réservation"
    });
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Tournée {tour.id}</h3>
          <p className="text-sm text-gray-500">{formatDate(tour.departure_date)}</p>
        </div>
        <TourStatusBadge status={tour.status} />
      </div>
      <TourTimeline 
        route={tour.route}
        onBookingClick={handleBookingClick}
        isBookingEnabled={tour.status === 'collecting'}
        bookingButtonText={getBookingButtonText(tour.status)}
      />
      <TourActions tour={tour} />
      <AuthDialog 
        open={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />
    </Card>
  );
}

function getBookingButtonText(status: Tour['status']) {
  switch(status) {
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
}