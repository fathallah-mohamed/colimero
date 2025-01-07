import { Check, PackageCheck, Truck, PackageOpen, Package } from "lucide-react";
import { TourStatus } from "@/types/tour";
import { cn } from "@/lib/utils";

interface TimelineIconProps {
  status: TourStatus;
  isCompleted?: boolean;
  isCurrent?: boolean;
  className?: string;
  variant?: 'client' | 'carrier';
}

export function TimelineIcon({ 
  status, 
  isCompleted, 
  isCurrent, 
  className,
  variant = 'carrier'
}: TimelineIconProps) {
  const iconClass = cn(
    "h-6 w-6 transition-transform duration-300",
    className,
    variant === 'client' 
      ? isCompleted || isCurrent ? "text-white" : "text-gray-400"
      : isCompleted ? "text-white" : isCurrent ? "text-white" : "text-gray-400"
  );

  if (isCompleted) {
    return <Check className={iconClass} />;
  }

  switch (status) {
    case "Programmée":
      return <Package className={iconClass} />;
    case "Ramassage en cours":
      return <PackageOpen className={iconClass} />;
    case "En transit":
      return <Truck className={iconClass} />;
    case "Terminée":
      return <PackageCheck className={iconClass} />;
    default:
      return <Package className={iconClass} />;
  }
}