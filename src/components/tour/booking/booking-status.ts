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
    case "confirmed":
      return "info";
    case "ready_to_deliver":
      return "purple";
    case "delivered":
      return "success";
    case "accepted":
      return "success";
    case "rejected":
      return "destructive";
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
    case "confirmed":
      return "Confirmé";
    case "ready_to_deliver":
      return "Prêt à livrer";
    case "delivered":
      return "Livré";
    case "accepted":
      return "Accepté";
    case "rejected":
      return "Refusé";
    default:
      return status;
  }
};