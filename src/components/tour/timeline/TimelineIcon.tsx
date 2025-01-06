import { CalendarCheck, PackageSearch, Truck, MapPin } from "lucide-react";
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

  switch (status) {
    case "Programmé":
      return <CalendarCheck className={iconClass} />;
    case "Ramassage en cours":
      return <PackageSearch className={iconClass} />;
    case "En transit":
      return <Truck className={iconClass} />;
    case "Livraison terminée":
      return <MapPin className={iconClass} />;
    default:
      return <CalendarCheck className={iconClass} />;
  }
}