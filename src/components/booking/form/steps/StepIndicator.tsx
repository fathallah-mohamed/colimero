import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

export function StepIndicator({ currentStep, totalSteps, completedSteps }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${
                  completedSteps.includes(index + 1)
                    ? "bg-primary border-primary text-white"
                    : currentStep === index + 1
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-300"
                }`}
            >
              {completedSteps.includes(index + 1) ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`h-1 w-16 mx-2 
                  ${
                    completedSteps.includes(index + 2)
                      ? "bg-primary"
                      : "bg-gray-300"
                  }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <div>Expéditeur</div>
        <div>Destinataire</div>
        <div>Colis</div>
        <div>Confirmation</div>
      </div>
    </div>
  );
}