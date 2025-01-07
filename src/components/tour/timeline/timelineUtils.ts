import { TourStatus } from "@/types/tour";

export const getTimelineLabel = (status: TourStatus, isCompleted: boolean): string => {
  if (isCompleted) {
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
  }
  return status;
};

export const getTimelineProgress = (currentStatus: TourStatus, statusOrder: TourStatus[]): number => {
  const currentIndex = statusOrder.indexOf(currentStatus);
  return ((currentIndex) / (statusOrder.length - 1)) * 100;
};