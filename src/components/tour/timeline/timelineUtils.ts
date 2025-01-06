import { TourStatus } from "@/types/tour";

export const getStatusLabel = (status: TourStatus) => {
  switch (status) {
    case "planned":
      return "Programmée";
    case "collecting":
      return "Ramassage en cours";
    case "collecting_completed":
      return "Ramassage terminé";
    case "in_transit":
      return "En transit";
    case "transport_completed":
      return "Transport terminé";
    case "delivery_in_progress":
      return "Livraison en cours";
    case "completed_completed":
      return "Livrée";
    case "cancelled":
      return "Annulée";
    default:
      return status;
  }
};