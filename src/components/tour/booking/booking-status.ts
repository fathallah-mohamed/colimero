import { BookingStatus } from "@/types/booking";

export const getStatusBadgeVariant = (status: BookingStatus) => {
  switch (status) {
    case "collected":
      return "success";
    case "cancelled":
      return "destructive";
    case "in_transit":
      return "secondary";
    case "pending":
      return "warning";
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
    case "accepted":
      return "Accepté";
    case "rejected":
      return "Refusé";
    case "delivered":
      return "Livré";
    default:
      return status;
  }
};