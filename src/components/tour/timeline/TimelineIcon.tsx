import { CalendarCheck, PackageSearch, Truck, MapPin } from "lucide-react";
import { TourStatus } from "@/types/tour";

interface TimelineIconProps {
  status: TourStatus;
  className?: string;
}

export function TimelineIcon({ status, className }: TimelineIconProps) {
  switch (status) {
    case "planned":
      return <CalendarCheck className={className} />;
    case "collecting":
      return <PackageSearch className={className} />;
    case "in_transit":
      return <Truck className={className} />;
    case "completed":
      return <MapPin className={className} />;
    default:
      return <CalendarCheck className={className} />;
  }
}