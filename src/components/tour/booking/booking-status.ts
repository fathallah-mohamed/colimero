import { BookingStatus } from "@/types/booking";

export const getStatusBadgeVariant = (status: BookingStatus) => {
  switch (status) {
    case "collected":
      return "success";
    case "cancelled":
      return "destructive";
    case "pending":
      return "warning";
    case "confirmed":
      return "secondary";
    case "ready_to_deliver":
      return "secondary";
    case "delivered":
      return "success";
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
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmé";
    case "ready_to_deliver":
      return "Prêt à livrer";
    case "delivered":
      return "Livré";
    default:
      return status;
  }
};