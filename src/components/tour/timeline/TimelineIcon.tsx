import { CalendarCheck, PackageSearch, Truck, MapPin, CheckCircle } from "lucide-react";
import { TourStatus } from "@/types/tour";
import { cn } from "@/lib/utils";

interface TimelineIconProps {
  status: TourStatus;
  isCompleted?: boolean;
  isCurrent?: boolean;
  className?: string;
}

export function TimelineIcon({ status, isCompleted, isCurrent, className }: TimelineIconProps) {
  const iconClass = cn(
    className,
    isCompleted ? "text-primary-foreground" : isCurrent ? "text-primary" : "text-gray-500"
  );

  // For completed statuses, always show the check icon
  if (status.includes("terminée") || status.includes("terminé")) {
    return <CheckCircle className={iconClass} />;
  }

  switch (status) {
    case "Programmé":
      return <CalendarCheck className={iconClass} />;
    case "Ramassage en cours":
      return <PackageSearch className={iconClass} />;
    case "En transit":
      return <Truck className={iconClass} />;
    case "Livraison en cours":
      return <MapPin className={iconClass} />;
    default:
      return <CalendarCheck className={iconClass} />;
  }
}