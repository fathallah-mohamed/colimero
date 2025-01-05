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
  const toast = useToast();

  const handleBookingClick = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour réserver.",
      });
      return;
    }
    if (onBookingClick) {
      onBookingClick(tour.id, tour.pickup_city);
    } else {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(tour.pickup_city)}`);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{tour.title}</h3>
          <p className="text-sm text-gray-500">{formatDate(tour.departure_date)}</p>
        </div>
        <TourStatusBadge status={tour.status} />
      </div>
      <TourTimeline tour={tour} />
      <TourActions 
        onBookingClick={handleBookingClick} 
        isUpcoming={isUpcoming} 
        hideAvatar={hideAvatar} 
        userType={userType} 
      />
    </Card>
  );
}
