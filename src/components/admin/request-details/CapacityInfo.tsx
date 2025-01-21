import { Tour } from "../approval-requests/types";

interface CapacityInfoProps {
  tour: Tour;
}

export function CapacityInfo({ tour }: CapacityInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Capacités</h3>
      <div className="space-y-2">
        <p>
          <span className="text-gray-500">Capacité totale :</span>{" "}
          {tour.total_capacity} kg
        </p>
        <p>
          <span className="text-gray-500">Capacité restante :</span>{" "}
          {tour.remaining_capacity} kg
        </p>
      </div>
    </div>
  );
}