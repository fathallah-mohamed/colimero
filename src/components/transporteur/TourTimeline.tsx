import { TourStatus } from "@/types/tour";

interface TourTimelineProps {
  status: TourStatus;
}

export function TourTimeline({ status }: TourTimelineProps) {
  const steps = [
    { key: 'planned', label: 'Planifiée' },
    { key: 'collecting', label: 'Collecte' },
    { key: 'in_transit', label: 'En transit' },
    { key: 'completed', label: 'Terminée' }
  ];

  const currentStep = steps.findIndex(step => step.key === status);

  return (
    <div className="w-full py-8">
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                  ${isCompleted 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white border-gray-300'
                  }
                  ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                `}
              >
                {isCompleted && (
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`mt-2 text-sm font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}

        {/* Ligne de progression */}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 -z-10">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ 
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}