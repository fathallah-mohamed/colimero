import { Badge } from "@/components/ui/badge";
import { TourStatus } from "@/types/tour";

interface TourStatusBadgeProps {
  status: TourStatus | null;
}

export function TourStatusBadge({ status }: TourStatusBadgeProps) {
  const getStatusColor = (status: TourStatus | null) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'collecting':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: TourStatus | null) => {
    switch (status) {
      case 'planned':
        return 'Planifiée';
      case 'collecting':
        return 'Collecte';
      case 'in_transit':
        return 'En transit';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Inconnu';
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
}