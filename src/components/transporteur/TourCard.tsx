import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tour } from "@/types/tour";
import { TourCapacityDisplay } from "./TourCapacityDisplay";
import { TourCardHeader } from "./TourCardHeader";
import { TourCollectionPoints } from "./TourCollectionPoints";
import { TourTimeline } from "./TourTimeline";
import { TourStatusSelect } from "@/components/tour/TourStatusSelect";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "@/components/auth/AuthDialog";

interface TourCardProps {
  tour: Tour;
  hideAvatar?: boolean;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  onStatusChange?: (newStatus: string) => void;
}

export function TourCard({ 
  tour, 
  hideAvatar,
  onBookingClick,
  onStatusChange 
}: TourCardProps) {
  const [isCarrierOwner, setIsCarrierOwner] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsCarrierOwner(session?.user?.id === tour.carrier_id);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsCarrierOwner(session?.user?.id === tour.carrier_id);
    });

    return () => subscription.unsubscribe();
  }, [tour.carrier_id]);

  const handleBookingClick = () => {
    if (!selectedPoint) return;
    
    if (!isAuthenticated) {
      setShowAuthDialog(true);
    } else {
      onBookingClick(tour.id, selectedPoint);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    if (selectedPoint) {
      onBookingClick(tour.id, selectedPoint);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <TourCardHeader tour={tour} hideAvatar={hideAvatar} />
        {isCarrierOwner && onStatusChange && (
          <div className="w-full md:w-auto">
            <TourStatusSelect
              tourId={tour.id}
              currentStatus={tour.status}
              onStatusChange={onStatusChange}
            />
          </div>
        )}
      </div>

      <TourTimeline status={tour.status} />

      <TourCapacityDisplay 
        remainingCapacity={tour.remaining_capacity} 
        totalCapacity={tour.total_capacity}
      />

      <TourCollectionPoints
        route={tour.route}
        selectedPoint={selectedPoint}
        onPointSelect={setSelectedPoint}
      />

      <div className="text-center text-sm text-gray-500">
        Départ pour la {tour.destination_country === "TN" ? "Tunisie" : "France"} le{" "}
        {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
      </div>

      <Button 
        className="w-full bg-blue-500 hover:bg-blue-600"
        onClick={handleBookingClick}
        disabled={!selectedPoint}
      >
        {selectedPoint ? "Réserver" : "Sélectionnez un point de collecte"}
      </Button>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />
    </div>
  );
}