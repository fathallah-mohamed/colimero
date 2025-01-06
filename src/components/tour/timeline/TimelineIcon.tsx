import { CalendarCheck, PackageSearch, Truck, MapPin, Check } from "lucide-react";
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

  // For completed statuses, show the check icon
  if (isCompleted) {
    return <Check className={iconClass} />;
  }

  switch (status) {
    case "Programmé":
    case "Préparation terminée":
      return <CalendarCheck className={iconClass} />;
    case "Ramassage en cours":
    case "Ramassage terminé":
      return <PackageSearch className={iconClass} />;
    case "En transit":
    case "Transport terminé":
      return <Truck className={iconClass} />;
    case "Livraison en cours":
    case "Livraison terminée":
      return <MapPin className={iconClass} />;
    default:
      return <CalendarCheck className={iconClass} />;
  }
}