import type { BookingStatus } from "@/types/booking";
import { BookingCardWrapper } from "./card/BookingCardWrapper";
import { BookingCardContent } from "./card/BookingCardContent";
import { BookingCardDetails } from "./card/BookingCardDetails";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BookingCardProps {
  booking: any;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  isEven?: boolean;
  tourStatus?: string;
}

export function BookingCard({ 
  booking, 
  isCollecting, 
  onStatusChange,
  onUpdate,
  isEven = false,
  tourStatus
}: BookingCardProps) {
  const [isCarrier, setIsCarrier] = useState(false);

  useEffect(() => {
    const checkCarrierStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && booking.tours?.carriers) {
        // Vérifie si l'utilisateur connecté est le transporteur de cette tournée
        setIsCarrier(session.user.id === booking.tours.carrier_id);
      }
    };

    checkCarrierStatus();
  }, [booking]);

  return (
    <BookingCardWrapper isEven={isEven}>
      <BookingCardContent
        booking={booking}
        isCollecting={isCollecting}
        onStatusChange={onStatusChange}
        onUpdate={onUpdate}
        tourStatus={tourStatus}
        isCarrier={isCarrier}
      />
    </BookingCardWrapper>
  );
}