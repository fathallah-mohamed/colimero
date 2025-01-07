import { TourStatus } from "@/types/tour";
import { TimelineBase } from "../shared/TimelineBase";

interface ClientTimelineProps {
  status: TourStatus;
  tourId: number;
}

export function ClientTimeline({ status, tourId }: ClientTimelineProps) {
  const statusOrder: TourStatus[] = [
    "Programmé",
    "Ramassage en cours",
    "En transit",
    "Livraison en cours"
  ];

  const getStatusLabel = (status: TourStatus, isCompleted: boolean): string => {
    if (!isCompleted) return status;

    switch (status) {
      case "Programmé":
        return "Préparation terminée";
      case "Ramassage en cours":
        return "Ramassage terminé";
      case "En transit":
        return "Transport terminé";
      case "Livraison en cours":
        return "Livraison terminée";
      default:
        return status;
    }
  };

  return (
    <TimelineBase
      status={status}
      statusOrder={statusOrder}
      getStatusLabel={getStatusLabel}
      canEdit={false}
    />
  );
}