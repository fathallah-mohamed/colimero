import { TourStatus } from "@/types/tour";

interface TourTimelineProps {
  status: TourStatus;
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
}

export function TourTimeline({ status, onStatusChange }: TourTimelineProps) {
  const steps = [
    { key: 'planned', label: 'Planifiée', icon: '✓' },
    { key: 'preparation_completed', label: 'Préparation terminée', icon: '✓' },
    { key: 'collecting_completed', label: 'Ramassage terminé', icon: '✓' },
    { key: 'transport_completed', label: 'Transport terminé', icon: '🚛' },
    { key: 'completed_completed', label: 'Livrée', icon: '✓' }
  ];

  const currentStep = steps.findIndex(step => step.key === status);

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;
          const isClickable = Math.abs(index - currentStep) === 1 && onStatusChange;
          
          return (
            <div 
              key={step.key} 
              className="flex flex-col items-center relative z-10"
              onClick={() => {
                if (isClickable && onStatusChange) {
                  onStatusChange(step.key as TourStatus);
                }
              }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                  ${isCompleted 
                    ? 'bg-green-500 border-2 border-green-500' 
                    : 'bg-white border-2 border-gray-300'
                  }
                  ${isCurrent ? 'ring-4 ring-green-100' : ''}
                  ${isClickable ? 'hover:scale-110 transition-transform' : ''}
                `}
              >
                {isCompleted && (
                  <span className="text-white">{step.icon}</span>
                )}
              </div>
              <span className={`mt-2 text-sm font-medium 
                ${isCurrent 
                  ? 'text-green-600' 
                  : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}

        {/* Ligne de progression */}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 -z-10">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ 
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}