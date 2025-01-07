import { Badge } from "@/components/ui/badge";
import type { TourStatus } from "@/types/tour";

interface TourStatusBadgeProps {
  status: TourStatus;
}

export function TourStatusBadge({ status }: TourStatusBadgeProps) {
  const getStatusColor = (status: TourStatus) => {
    switch (status) {
      case "Programmée":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Ramassage en cours":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "En transit":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Terminée":
        return "bg-green-100 text-green-800 hover:bg-green-100";
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