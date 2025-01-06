import { TourStatus } from "@/types/tour";

export const getStatusLabel = (status: TourStatus) => {
  switch (status) {
    case "planned":
      return "Programmée";
    case "collecting":
      return "Collecte";
    case "in_transit":
      return "En transit";
    case "transport_completed":
      return "Transport terminé";
    case "collecting_completed":
      return "Ramassage terminé";
    case "preparation_completed":
      return "Préparation terminée";
    case "delivery_in_progress":
      return "Livraison en cours";
    case "completed_completed":
      return "Livrée";
    default:
      return status;
  }
};