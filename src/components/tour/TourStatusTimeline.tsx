import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "./timeline/TimelineStatus";
import { TimelineProgress } from "./timeline/TimelineProgress";
import { CancelledStatus } from "./timeline/CancelledStatus";

interface TourStatusTimelineProps {
  tourId: number;
  status: TourStatus;
  onStatusChange: (newStatus: TourStatus) => void;
}

export function TourStatusTimeline({ tourId, status, onStatusChange }: TourStatusTimelineProps) {
  console.log('TourStatusTimeline rendered with status:', status);
  
  // Si la tournée est annulée, afficher uniquement le statut d'annulation
  if (status === "Annulée") {
    return <CancelledStatus />;
  }

  const getStatusOrder = (currentStatus: TourStatus): TourStatus[] => {
    switch (currentStatus) {
      case "Programmé":
        return [
          "Programmé",
          "Ramassage en cours",
          "En transit",
          "Livraison en cours"
        ];
      case "Ramassage en cours":
        return [
          "Préparation terminée",
          "Ramassage en cours",
          "En transit",
          "Livraison en cours",
          "Livraison terminée"
        ];
      case "En transit":
        return [
          "Ramassage terminé",
          "En transit",
          "Livraison en cours",
          "Livraison terminée"
        ];
      case "Livraison en cours":
        return [
          "Transport terminé",
          "Livraison en cours",
          "Livraison terminée"
        ];
      case "Livraison terminée":
        return [
          "Livraison terminée"
        ];
      default:
        return [
          "Programmé",
          "Ramassage en cours",
          "En transit",
          "Livraison en cours"
        ];
    }
  };

  const statusOrder = getStatusOrder(status);
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="relative flex justify-between items-center w-full mt-4">
      <TimelineProgress currentIndex={currentIndex} statusOrder={statusOrder} />
      
      {statusOrder.map((statusItem, index) => (
        <TimelineStatus
          key={statusItem}
          tourId={tourId}
          status={statusItem}
          currentStatus={status}
          currentIndex={currentIndex}
          index={index}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}