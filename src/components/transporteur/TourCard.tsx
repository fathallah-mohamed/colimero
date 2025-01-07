import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Euro, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TourCardProps {
  tour: any;
  hideAvatar?: boolean;
  onBookingClick?: (tourId: number, pickupCity: string) => void;
}

export function TourCard({ tour, onBookingClick }: TourCardProps) {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const { toast } = useToast();
  const pricePerKg = tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 0;

  const handleRequestApproval = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour faire une demande d'approbation",
        variant: "destructive"
      });
      return;
    }
    setShowApprovalDialog(true);
  };

  const handleBookingClick = (pickupCity: string) => {
    if (onBookingClick) {
      onBookingClick(tour.id, pickupCity);
    } else {
      window.location.href = `/reserver/${tour.id}`;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow">
      {/* Header with carrier info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <img 
            src={tour.carriers?.avatar_url || "/placeholder.svg"} 
            alt={tour.carriers?.company_name}
            className="w-8 h-8 rounded-full"
          />
        </div>
        <div>
          <h3 className="text-base font-medium">
            {tour.carriers?.company_name || "Express Transit"}
          </h3>
          <Badge variant="secondary" className="text-xs">
            Vérifié
          </Badge>
        </div>
      </div>

      {/* Route info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-5 w-5 text-primary/60" />
          <div>
            <p className="text-sm text-gray-500">Trajet</p>
            <p className="font-medium">
              {tour.departure_country === 'FR' ? 'France' : tour.departure_country} → {' '}
              {tour.destination_country === 'TN' ? 'Tunisie' : tour.destination_country}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Euro className="h-5 w-5 text-primary/60" />
          <div>
            <p className="text-sm text-gray-500">Prix</p>
            <p className="font-medium">{pricePerKg}€/kg</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-5 w-5 text-primary/60" />
          <div>
            <p className="text-sm text-gray-500">Date de départ</p>
            <p className="font-medium">
              {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-primary hover:text-primary/90 hover:bg-primary/10"
          onClick={() => handleBookingClick(tour.route?.[0]?.name || '')}
        >
          Plus de détails
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <ApprovalRequestDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        tourId={tour.id}
        pickupCity={tour.route?.[0]?.name || ''}
      />
    </div>
  );
}