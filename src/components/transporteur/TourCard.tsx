import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookingDialog } from "@/components/booking/BookingDialog";
import AuthDialog from "@/components/auth/AuthDialog";

interface TourCardProps {
  tour: {
    id: number;
    route: { name: string }[];
    destination_country: string;
  };
}

export function TourCard({ tour }: TourCardProps) {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    
    checkSession();
  }, []);

  const handleBookClick = () => {
    if (!session) {
      setShowAuthDialog(true);
    } else {
      setShowBookingDialog(true);
    }
  };

  return (
    <>
      <div className="tour-card">
        <h2>{tour.route[0].name}</h2>
        <button onClick={handleBookClick}>Book Now</button>
      </div>
      
      <BookingDialog
        isOpen={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        tourId={tour.id}
        pickupCity={tour.route[0].name}
        destinationCountry={tour.destination_country}
      />

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          setShowBookingDialog(true);
        }}
        requiredUserType="client"
      />
    </>
  );
}