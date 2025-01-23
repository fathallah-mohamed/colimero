import { TourStatusBadge } from "./TourStatusBadge";
import { useTourRealtime } from "@/hooks/useTourRealtime";
import type { Tour } from "@/types/tour";

interface TourStatusDisplayProps {
  tour: Tour;
}

export function TourStatusDisplay({ tour }: TourStatusDisplayProps) {
  const updatedTour = useTourRealtime(tour.id);
  const currentStatus = updatedTour?.status || tour.status;

  return <TourStatusBadge status={currentStatus} />;
}