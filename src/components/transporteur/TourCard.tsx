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

interface TourCardProps {
  tour: Tour;
  selectedPoint: string | undefined;
  onPointSelect: (cityName: string) => void;
  onReservation: () => void;
  hideAvatar?: boolean;
  onStatusChange?: (newStatus: string) => void;
}

export function TourCard({ 
  tour, 
  selectedPoint, 
  onPointSelect, 
  onReservation, 
  hideAvatar,
  onStatusChange 
}: TourCardProps) {
  const [isCarrierOwner, setIsCarrierOwner] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsCarrierOwner(session?.user?.id === tour.carrier_id);
    };
    checkOwnership();
  }, [tour.carrier_id]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-start">
        <TourCardHeader tour={tour} hideAvatar={hideAvatar} />
        {isCarrierOwner && onStatusChange && (
          <TourStatusSelect
            tourId={tour.id}
            currentStatus={tour.status}
            onStatusChange={onStatusChange}
          />
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
        onPointSelect={onPointSelect}
      />

      <div className="text-center text-sm text-gray-500">
        Départ pour la {tour.destination_country === "TN" ? "Tunisie" : "France"} le{" "}
        {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
      </div>

      <Button 
        className="w-full bg-blue-500 hover:bg-blue-600"
        onClick={onReservation}
        disabled={!selectedPoint}
      >
        {selectedPoint ? "Réserver" : "Sélectionnez un point de collecte"}
      </Button>
    </div>
  );
}