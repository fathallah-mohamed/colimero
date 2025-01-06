import { Check, Truck } from "lucide-react";
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
    "h-6 w-6",
    className,
    isCompleted ? "text-white" : isCurrent ? "text-white" : "text-gray-400"
  );

  if (isCompleted) {
    return <Check className={iconClass} />;
  }

  switch (status) {
    case "Programmé":
      return <Check className={iconClass} />;
    case "Ramassage en cours":
      return <Check className={iconClass} />;
    case "En transit":
      return <Truck className={iconClass} />;
    case "Livraison en cours":
      return <Truck className={iconClass} />;
    case "Livraison terminée":
      return <Check className={iconClass} />;
    default:
      return <Check className={iconClass} />;
  }
}