import { TourStatus } from "@/types/tour";

export const getTimelineLabel = (status: TourStatus): string => {
  switch (status) {
    case "planned":
      return "Tournée planifiée";
    case "collecting":
      return "Collecte en cours";
    case "collection_completed":
      return "Collecte terminée";
    case "in_transit":
      return "En transit";
    case "delivering":
      return "Livraison en cours";
    case "completed":
      return "Tournée terminée";
    case "cancelled":
      return "Tournée annulée";
    default:
      return "Statut inconnu";
  }
};

export const getTimelineProgress = (status: TourStatus): number => {
  switch (status) {
    case "planned":
      return 0;
    case "collecting":
      return 20;
    case "collection_completed":
      return 40;
    case "in_transit":
      return 60;
    case "delivering":
      return 80;
    case "completed":
      return 100;
    case "cancelled":
      return 100;
    default:
      return 0;
  }
};

export const getNextStatus = (currentStatus: TourStatus): TourStatus | null => {
  switch (currentStatus) {
    case "planned":
      return "collecting";
    case "collecting":
      return "collection_completed";
    case "collection_completed":
      return "in_transit";
    case "in_transit":
      return "delivering";
    case "delivering":
      return "completed";
    default:
      return null;
  }
};

export const canTransitionTo = (currentStatus: TourStatus, newStatus: TourStatus): boolean => {
  if (newStatus === "cancelled") return true;
  return getNextStatus(currentStatus) === newStatus;
};