import { TourStatus } from "@/types/tour";

export const getStatusLabel = (status: TourStatus) => {
  switch (status) {
    case "planned":
      return "Planifiée";
    case "collecting":
      return "Collecte";
    case "in_transit":
      return "En transit";
    case "in_transit_completed":
      return "Livraison en cours";
    case "completed_completed":
      return "Livrée";
    default:
      return status;
  }
};