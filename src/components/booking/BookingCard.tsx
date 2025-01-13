import type { BookingStatus } from "@/types/booking";
import { BookingCardWrapper } from "./card/BookingCardWrapper";
import { BookingCardContent } from "./card/BookingCardContent";

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
  return (
    <BookingCardWrapper isEven={isEven}>
      <BookingCardContent
        booking={booking}
        isCollecting={isCollecting}
        onStatusChange={onStatusChange}
        onUpdate={onUpdate}
        tourStatus={tourStatus}
      />
    </BookingCardWrapper>
  );
}