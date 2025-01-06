import { CalendarCheck, PackageSearch, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { TourStatus } from "@/types/tour";
import { cn } from "@/lib/utils";

interface TimelineIconProps {
  status: TourStatus;
  isCompleted?: boolean;
  isCurrent?: boolean;
  className?: string;
}

export function TimelineIcon({ status, isCompleted, isCurrent, className }: TimelineIconProps) {
  if (isCompleted) {
    return <CheckCircle2 className={cn("text-green-500", className)} />;
  }

  const iconClass = cn(
    className,
    isCurrent ? "text-primary" : "text-gray-500"
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
      return <CalendarCheck className={iconClass} />;
  }
}