import { CalendarCheck, PackageSearch, Truck, MapPin } from "lucide-react";
import { TourStatus } from "@/types/tour";

export const getIcon = (status: TourStatus) => {
  switch (status) {
    case "planned":
      return <CalendarCheck className="h-6 w-6" />;
    case "collecting":
      return <PackageSearch className="h-6 w-6" />;
    case "in_transit":
      return <Truck className="h-6 w-6" />;
    case "delivery_in_progress":
      return <MapPin className="h-6 w-6" />;
    default:
      return null;
  }
};

export const getStatusLabel = (status: TourStatus) => {
  switch (status) {
    case "planned":
      return "Programmée";
    case "preparation_completed":
      return "Préparation terminée";
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
      return "Livraison terminée";
    case "cancelled":
      return "Annulée";
    default:
      return status;
  }
};