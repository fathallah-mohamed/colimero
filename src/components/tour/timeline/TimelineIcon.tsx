import { Check, Truck, Package } from "lucide-react";
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
    "h-6 w-6 transition-transform duration-300",
    className
  );

  if (isCompleted) {
    return <Check className={iconClass} />;
  }

  switch (status) {
    case "Programmé":
      return <Package className={iconClass} />;
    case "Ramassage en cours":
      return <Package className={iconClass} />;
    case "En transit":
      return <Truck className={iconClass} />;
    case "Livraison terminée":
      return <Check className={iconClass} />;
    default:
      return <Package className={iconClass} />;
  }
}