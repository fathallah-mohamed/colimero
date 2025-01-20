import { Tour } from "@/types/tour";

interface TourDetailsProps {
  tour: Tour;
}

export function TourDetails({ tour }: TourDetailsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Tournée {tour.tour_number || `#${tour.id}`}
        </h3>
        <p className="text-sm text-gray-600">
          {tour.carriers?.company_name}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Départ</p>
          <p className="text-sm text-gray-900">{tour.departure_country}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Destination</p>
          <p className="text-sm text-gray-900">{tour.destination_country}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Date de départ</p>
          <p className="text-sm text-gray-900">
            {new Date(tour.departure_date).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Capacité disponible</p>
          <p className="text-sm text-gray-900">{tour.remaining_capacity} kg</p>
        </div>
      </div>
    </div>
  );
}