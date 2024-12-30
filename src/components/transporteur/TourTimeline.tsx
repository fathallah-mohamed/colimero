import { CheckCircle2, Circle, Truck, XCircle } from "lucide-react";

interface TourTimelineProps {
  status: 'planned' | 'collecting' | 'in_transit' | 'completed' | 'cancelled';
}

export function TourTimeline({ status }: TourTimelineProps) {
  const getStepStatus = (step: string) => {
    const statusOrder = ['planned', 'collecting', 'in_transit', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(step);
    
    return currentIndex > stepIndex;
  };

  if (status === 'cancelled') {
    return (
      <div className="flex items-center justify-center w-full py-4">
        <div className="flex flex-col items-center">
          <XCircle className="h-8 w-8 text-red-500" />
          <span className="text-sm mt-1 text-red-500 font-medium">Tournée annulée</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full py-4">
      <div className="flex flex-col items-center">
        {getStepStatus('planned') ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <Circle 
            className={`h-6 w-6 ${status === 'planned' ? 'text-blue-500' : 'text-gray-400'}`} 
            fill={status === 'planned' ? 'currentColor' : 'none'} 
          />
        )}
        <span className="text-xs mt-1">Planifiée</span>
      </div>

      <div className="h-[2px] flex-1 bg-gray-200 mx-2" />

      <div className="flex flex-col items-center">
        {getStepStatus('collecting') ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <Circle 
            className={`h-6 w-6 ${status === 'collecting' ? 'text-blue-500' : 'text-gray-400'}`}
            fill={status === 'collecting' ? 'currentColor' : 'none'}
          />
        )}
        <span className="text-xs mt-1">Collecte</span>
      </div>

      <div className="h-[2px] flex-1 bg-gray-200 mx-2" />

      <div className="flex flex-col items-center">
        {getStepStatus('in_transit') ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <Truck 
            className={`h-6 w-6 ${status === 'in_transit' ? 'text-blue-500' : 'text-gray-400'}`}
          />
        )}
        <span className="text-xs mt-1">Livraison</span>
      </div>

      <div className="h-[2px] flex-1 bg-gray-200 mx-2" />

      <div className="flex flex-col items-center">
        <CheckCircle2 
          className={`h-6 w-6 ${status === 'completed' ? 'text-green-500' : 'text-gray-400'}`}
        />
        <span className="text-xs mt-1">Terminée</span>
      </div>
    </div>
  );
}