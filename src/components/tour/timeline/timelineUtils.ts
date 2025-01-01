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
    case "completed":
      return <MapPin className="h-6 w-6" />;
    default:
      return null;
  }
};

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