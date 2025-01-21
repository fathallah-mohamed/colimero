import { Tour } from "../approval-requests/types";

interface RequestHeaderProps {
  tour: Tour;
}

export function RequestHeader({ tour }: RequestHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-medium">{tour.departure_country}</span>
        <span>→</span>
        <span className="font-medium">{tour.destination_country}</span>
      </div>
      <p className="text-gray-600">
        Transporteur : {tour.carriers?.company_name}
      </p>
    </div>
  );
}