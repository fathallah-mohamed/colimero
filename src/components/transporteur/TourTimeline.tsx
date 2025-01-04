import { TourStatus } from "@/types/tour";

interface TourTimelineProps {
  status: TourStatus;
}

export function TourTimeline({ status }: TourTimelineProps) {
  // Si la tournée est annulée, afficher uniquement le statut annulé
  if (status === 'cancelled') {
    return (
      <div className="flex items-center justify-center w-full py-6">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-red-100 p-3 rounded-full">
            <span className="text-red-500 text-lg">×</span>
          </div>
          <span className="text-sm font-medium text-red-500">Tournée annulée</span>
        </div>
      </div>
    );
  }

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
          
          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${isCompleted 
                    ? 'bg-green-500 border-2 border-green-500' 
                    : 'bg-white border-2 border-gray-300'
                  }
                  ${isCurrent ? 'ring-4 ring-green-100' : ''}
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