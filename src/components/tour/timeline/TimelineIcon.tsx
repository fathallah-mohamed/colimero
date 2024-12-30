import { cn } from "@/lib/utils";
import { CalendarCheck, PackageSearch, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { TourStatus } from "../../../types/tour";

interface TimelineIconProps {
  status: TourStatus;
  isCompleted: boolean;
  isCurrent: boolean;
}

export function TimelineIcon({ status, isCompleted, isCurrent }: TimelineIconProps) {
  if (isCompleted) {
    return <CheckCircle2 className="h-10 w-10 text-green-500" />;
  }

  const iconClass = cn(
    "h-10 w-10",
    isCurrent ? "text-primary" : "text-gray-300"
  );

  switch (status) {
    case "planned":
      return <CalendarCheck className={iconClass} />;
    case "collecting":
      return <PackageSearch className={iconClass} />;
    case "in_transit":
      return <Truck className={iconClass} />;
    case "completed":
      return <MapPin className={iconClass} />;
    default:
      return null;
  }
}