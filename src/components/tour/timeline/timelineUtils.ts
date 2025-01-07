import { TourStatus } from "@/types/tour";

export const getTimelineLabel = (status: TourStatus): string => {
  switch (status) {
    case "Programmé":
      return "Tournée planifiée";
    case "Ramassage en cours":
      return "Collecte en cours";
    case "Ramassage terminé":
      return "Collecte terminée";
    case "En transit":
      return "En transit";
    case "Livraison en cours":
      return "Livraison en cours";
    case "Livraison terminée":
      return "Tournée terminée";
    case "Annulée":
      return "Tournée annulée";
    default:
      return "Statut inconnu";
  }
};

export const getTimelineProgress = (status: TourStatus): number => {
  switch (status) {
    case "Programmé":
      return 0;
    case "Ramassage en cours":
      return 20;
    case "Ramassage terminé":
      return 40;
    case "En transit":
      return 60;
    case "Livraison en cours":
      return 80;
    case "Livraison terminée":
      return 100;
    case "Annulée":
      return 100;
    default:
      return 0;
  }
};

export const getNextStatus = (currentStatus: TourStatus): TourStatus | null => {
  switch (currentStatus) {
    case "Programmé":
      return "Ramassage en cours";
    case "Ramassage en cours":
      return "Ramassage terminé";
    case "Ramassage terminé":
      return "En transit";
    case "En transit":
      return "Livraison en cours";
    case "Livraison en cours":
      return "Livraison terminée";
    default:
      return null;
  }
};

export const canTransitionTo = (currentStatus: TourStatus, newStatus: TourStatus): boolean => {
  if (newStatus === "Annulée") return true;
  return getNextStatus(currentStatus) === newStatus;
};