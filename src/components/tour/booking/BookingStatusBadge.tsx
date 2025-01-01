import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types/booking";
import { getStatusBadgeVariant, getStatusLabel } from "./booking-status";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
}