interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

export function StepIndicator({ currentStep, totalSteps, completedSteps }: StepIndicatorProps) {
  return (
    <div className="flex justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`flex items-center ${
            step < totalSteps ? "flex-1" : ""
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step === currentStep
                ? "border-blue-500 bg-blue-50 text-blue-500"
                : completedSteps.includes(step)
                ? "border-green-500 bg-green-50 text-green-500"
                : "border-gray-300 text-gray-500"
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div
              className={`flex-1 h-0.5 mx-2 ${
                completedSteps.includes(step)
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}