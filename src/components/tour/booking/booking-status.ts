import { BookingStatus } from "@/types/booking";

export const getStatusBadgeVariant = (status: BookingStatus) => {
  switch (status) {
    case "collected":
      return "default";
    case "cancelled":
      return "destructive";
    case "in_transit":
      return "secondary";
    default:
      return "secondary";
  }
};

export const getStatusLabel = (status: BookingStatus) => {
  switch (status) {
    case "collected":
      return "Collecté";
    case "cancelled":
      return "Annulé";
    case "in_transit":
      return "En transit";
    case "pending":
      return "En attente";
    default:
      return status;
  }
};