import { Check, Circle, Truck, Flag, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TourStatus } from "@/types/tour";

interface TimelineIconProps {
  status: TourStatus;
  isCompleted: boolean;
  isCurrent: boolean;
  className?: string;
}

export function TimelineIcon({ status, isCompleted, isCurrent, className }: TimelineIconProps) {
  const baseIconClass = cn(
    "transition-all duration-200",
    isCompleted ? "text-primary" : "text-gray-400",
    isCurrent ? "text-primary" : "",
    className
  );

  if (status === 'cancelled') {
    return <XCircle className={cn(baseIconClass, "text-red-500")} />;
  }

  if (isCompleted) {
    return <Check className={baseIconClass} />;
  }

  if (isCurrent) {
    switch (status) {
      case 'planned':
        return <Circle className={baseIconClass} />;
      case 'collecting':
        return <Circle className={baseIconClass} />;
      case 'in_transit':
        return <Truck className={baseIconClass} />;
      case 'completed':
        return <Flag className={baseIconClass} />;
      default:
        return <Circle className={baseIconClass} />;
    }
  }

  // État inactif
  switch (status) {
    case 'planned':
      return <Circle className={baseIconClass} />;
    case 'collecting':
      return <Circle className={baseIconClass} />;
    case 'in_transit':
      return <Truck className={baseIconClass} />;
    case 'completed':
      return <Flag className={baseIconClass} />;
    default:
      return <Circle className={baseIconClass} />;
  }
}