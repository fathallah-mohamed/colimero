import { TourStatus } from "@/types/tour";

export const getStatusLabel = (status: TourStatus) => {
  switch (status) {
    case "planned":
      return "Planifiée";
    case "collecting":
      return "Collecte";
    case "in_transit":
      return "Livraison";
    case "completed":
      return "Terminée";
    default:
      return status;
  }
};