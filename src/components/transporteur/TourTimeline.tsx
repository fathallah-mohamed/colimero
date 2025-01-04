import { TourStatus } from "@/types/tour";

interface TourTimelineProps {
  status: TourStatus;
}

export function TourTimeline({ status }: TourTimelineProps) {
  const steps = [
    { key: 'planned', label: 'Planifiée', icon: '✓' },
    { key: 'collecting', label: 'Collecte', icon: '✓' },
    { key: 'in_transit', label: 'Livraison', icon: '🚛' },
    { key: 'completed', label: 'Terminée', icon: '✓' }
  ];

  const currentStep = steps.findIndex(step => step.key === status);

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;
          const isCancelled = status === 'cancelled';
          
          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${isCancelled 
                    ? 'bg-white border-2 border-red-500' 
                    : isCompleted 
                      ? 'bg-green-500 border-2 border-green-500' 
                      : 'bg-white border-2 border-gray-300'
                  }
                  ${isCurrent && !isCancelled ? 'ring-4 ring-green-100' : ''}
                `}
              >
                {isCancelled ? (
                  <span className="text-red-500 text-lg">×</span>
                ) : isCompleted ? (
                  <span className="text-white">{step.icon}</span>
                ) : null}
              </div>
              <span className={`mt-2 text-sm font-medium 
                ${isCancelled 
                  ? 'text-red-500' 
                  : isCurrent 
                    ? 'text-green-600' 
                    : 'text-gray-500'
                }`}
              >
                {isCancelled && index === currentStep ? 'Annulée' : step.label}
              </span>
            </div>
          );
        })}

        {/* Ligne de progression */}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 -z-10">
          <div 
            className={`h-full transition-all duration-300 ${
              status === 'cancelled' ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ 
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}