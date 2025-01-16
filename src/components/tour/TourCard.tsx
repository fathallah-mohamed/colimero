import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TourStatusBadge } from "./TourStatusBadge";
import { TourCapacityInfo } from "./TourCapacityInfo";
import { Card } from "@/components/ui/card";
import { TourStatusTimeline } from "./TourStatusTimeline";
import { TourBookingsList } from "./TourBookingsList";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Tour } from "@/types/tour";
import { useNavigate } from "react-router-dom";

interface TourCardProps {
  tour: Tour;
  isEven?: boolean;
  showBookings?: boolean;
  onStatusChange?: (bookingId: string, newStatus: string) => Promise<void>;
}

export function TourCard({ 
  tour, 
  isEven = false,
  showBookings = false,
  onStatusChange 
}: TourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleReserverClick = () => {
    navigate(`/reserver?tourId=${tour.id}`);
  };

  return (
    <Card className={`p-6 ${isEven ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">
                Tournée {tour.tour_number}
              </h3>
              <TourStatusBadge status={tour.status} />
            </div>
            <p className="text-sm text-gray-500">
              {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
            </p>
          </div>
          {tour.status === "Programmée" && (
            <Button onClick={handleReserverClick}>
              Réserver
            </Button>
          )}
        </div>

        <TourCapacityInfo
          totalCapacity={tour.total_capacity}
          remainingCapacity={tour.remaining_capacity}
          bookingsCount={0}
        />

        <TourStatusTimeline 
          tourId={tour.id} 
          status={tour.status} 
          onStatusChange={(newStatus) => {
            // Handle status change
            console.log("Status changed to:", newStatus);
          }} 
        />

        {showBookings && (
          <>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Masquer les réservations
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Voir les réservations
                </>
              )}
            </Button>

            {isExpanded && (
              <TourBookingsList
                tourId={tour.id}
                tourStatus={tour.status}
              />
            )}
          </>
        )}
      </div>
    </Card>
  );
}