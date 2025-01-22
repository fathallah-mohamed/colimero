import { ApprovalRequest } from "../approval-requests/types";

interface CapacityInfoProps {
  request: ApprovalRequest;
}

export function CapacityInfo({ request }: CapacityInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Capacités</h3>
      <div className="space-y-2">
        <p>
          <span className="text-gray-500">Capacité totale :</span>{" "}
          {request.tour.total_capacity} kg
        </p>
        <p>
          <span className="text-gray-500">Capacité restante :</span>{" "}
          {request.tour.remaining_capacity} kg
        </p>
      </div>
    </div>
  );
}