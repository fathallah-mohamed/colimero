import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import AuthDialog from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/use-auth";
import { Tour } from "@/types/tour";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick?: (tourId: number, pickupCity: string) => void;
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleBookingClick = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    if (onBookingClick) {
      onBookingClick(tour.id, tour.route[0]?.name || '');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{tour.carrier_id}</h3>
          <p className="text-sm text-gray-500">{formatDate(tour.departure_date)}</p>
        </div>
        <Badge variant={isUpcoming ? "success" : "default"}>
          {isUpcoming ? "À venir" : "Passé"}
        </Badge>
      </div>
      <div className="mt-4">
        <p>{tour.route.map(stop => stop.name).join(', ')}</p>
      </div>
      <div className="mt-6">
        <button onClick={handleBookingClick} className="w-full bg-blue-500 text-white py-2 rounded">
          Réserver
        </button>
      </div>
      <AuthDialog 
        open={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        fromHeader={false}
      />
    </Card>
  );
}
