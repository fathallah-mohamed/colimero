import { Badge } from "@/components/ui/badge";
import type { TourStatus } from "@/types/tour";

interface TourStatusBadgeProps {
  status: TourStatus;
}

export function TourStatusBadge({ status }: TourStatusBadgeProps) {
  const getStatusColor = (status: TourStatus) => {
    switch (status) {
      case "Programmé":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Ramassage en cours":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "En transit":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Livraison en cours":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
      case "Livraison terminée":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Préparation terminée":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "Ramassage terminé":
        return "bg-teal-100 text-teal-800 hover:bg-teal-100";
      case "Transport terminé":
        return "bg-cyan-100 text-cyan-800 hover:bg-cyan-100";
      case "Annulé":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border-none`}>
      {status}
    </Badge>
  );
}