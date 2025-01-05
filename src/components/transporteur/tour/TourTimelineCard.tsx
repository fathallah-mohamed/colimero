import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useState } from "react";
import { Tour } from "@/types/tour";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  hideAvatar?: boolean;
}

export function TourTimelineCard({ tour, onBookingClick, hideAvatar = false }: TourTimelineCardProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    // Get the first pickup city from the route
    const pickupCity = tour.route[0]?.name || '';
    onBookingClick(tour.id, pickupCity);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-bold">Tournée #{tour.id}</h2>
      <p className="text-gray-600">
        {tour.route.map(stop => stop.name).join(' → ')}
      </p>
      <div className="mt-4">
        <Button onClick={() => setShowAuthDialog(true)}>Réserver</Button>
      </div>

      <AuthDialog 
        open={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />
    </div>
  );
}