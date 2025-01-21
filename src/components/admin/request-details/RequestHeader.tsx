import { ApprovalRequest } from "../approval-requests/types";

interface RequestHeaderProps {
  tour?: ApprovalRequest['tour'] | null;
}

export function RequestHeader({ tour }: RequestHeaderProps) {
  if (!tour) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold">
        {tour.departure_country} → {tour.destination_country}
      </h2>
      <p className="text-gray-600">
        Transporteur : {tour.carrier.company_name}
      </p>
    </div>
  );
}