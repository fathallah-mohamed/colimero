import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/types/booking";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "accepted":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "collected":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "in_transit":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "accepted":
        return "Acceptée";
      case "rejected":
        return "Refusée";
      case "collected":
        return "Collectée";
      case "in_transit":
        return "En transit";
      case "delivered":
        return "Livrée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border-none`}>
      {getStatusLabel(status)}
    </Badge>
  );
}