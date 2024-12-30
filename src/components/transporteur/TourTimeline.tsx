import { CheckCircle2, Circle, Truck } from "lucide-react";

interface TourTimelineProps {
  status: 'planned' | 'collecting' | 'in_transit' | 'completed';
}

export function TourTimeline({ status }: TourTimelineProps) {
  return (
    <div className="flex items-center justify-between w-full py-4">
      <div className="flex flex-col items-center">
        <Circle 
          className={`h-6 w-6 ${status === 'planned' ? 'text-blue-500' : 'text-gray-400'}`} 
          fill={status === 'planned' ? 'currentColor' : 'none'} 
        />
        <span className="text-xs mt-1">Planifiée</span>
      </div>

      <div className="h-[2px] flex-1 bg-gray-200 mx-2" />

      <div className="flex flex-col items-center">
        <Circle 
          className={`h-6 w-6 ${status === 'collecting' ? 'text-blue-500' : 'text-gray-400'}`}
          fill={status === 'collecting' ? 'currentColor' : 'none'}
        />
        <span className="text-xs mt-1">Collecte</span>
      </div>

      <div className="h-[2px] flex-1 bg-gray-200 mx-2" />

      <div className="flex flex-col items-center">
        <Truck 
          className={`h-6 w-6 ${status === 'in_transit' ? 'text-blue-500' : 'text-gray-400'}`}
        />
        <span className="text-xs mt-1">En route</span>
      </div>

      <div className="h-[2px] flex-1 bg-gray-200 mx-2" />

      <div className="flex flex-col items-center">
        <CheckCircle2 
          className={`h-6 w-6 ${status === 'completed' ? 'text-blue-500' : 'text-gray-400'}`}
        />
        <span className="text-xs mt-1">Terminée</span>
      </div>
    </div>
  );
}