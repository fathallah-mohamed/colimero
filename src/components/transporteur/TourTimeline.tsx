import { CheckCircle2, Circle, Truck } from "lucide-react";

interface TourTimelineProps {
  departureDate: string;
}

export function TourTimeline({ departureDate }: TourTimelineProps) {
  const today = new Date();
  const departure = new Date(departureDate);
  const isBeforeDeparture = today < departure;
  const isAfterDeparture = today > departure;
  const isOnDepartureDay = today.toDateString() === departure.toDateString();

  return (
    <div className="flex items-center justify-between w-full py-4">
      <div className="flex flex-col items-center">
        <Circle 
          className={`h-6 w-6 ${isBeforeDeparture ? 'text-blue-500' : 'text-gray-400'}`} 
          fill={isBeforeDeparture ? 'currentColor' : 'none'} 
        />
        <span className="text-xs mt-1">Planifiée</span>
      </div>

      <div className="h-[2px] flex-1 bg-gray-200 mx-2" />

      <div className="flex flex-col items-center">
        <Circle 
          className={`h-6 w-6 ${isOnDepartureDay ? 'text-blue-500' : 'text-gray-400'}`}
          fill={isOnDepartureDay ? 'currentColor' : 'none'}
        />
        <span className="text-xs mt-1">Collecte</span>
      </div>

      <div className="h-[2px] flex-1 bg-gray-200 mx-2" />

      <div className="flex flex-col items-center">
        <Truck 
          className={`h-6 w-6 ${isAfterDeparture ? 'text-blue-500' : 'text-gray-400'}`}
        />
        <span className="text-xs mt-1">En route</span>
      </div>

      <div className="h-[2px] flex-1 bg-gray-200 mx-2" />

      <div className="flex flex-col items-center">
        <CheckCircle2 className="h-6 w-6 text-gray-400" />
        <span className="text-xs mt-1">Terminée</span>
      </div>
    </div>
  );
}