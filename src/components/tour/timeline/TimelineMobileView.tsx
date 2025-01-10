import { TourStatus } from "@/types/tour";
import { cn } from "@/lib/utils";
import { Package, Truck, CheckCircle2, MapPin } from "lucide-react";

interface TimelineMobileViewProps {
  status: TourStatus;
  variant?: 'client' | 'carrier';
}

export function TimelineMobileView({ status, variant = 'carrier' }: TimelineMobileViewProps) {
  const steps = [
    { status: "Programmée", icon: Package, label: "Programmée" },
    { status: "Ramassage en cours", icon: Truck, label: "Ramassage" },
    { status: "En transit", icon: MapPin, label: "En transit" },
    { status: "Terminée", icon: CheckCircle2, label: "Terminée" }
  ];

  const currentIndex = steps.findIndex(step => step.status === status);

  const getStepColor = (index: number) => {
    if (variant === 'client') {
      if (index <= currentIndex) {
        return "text-[#0FA0CE] border-[#0FA0CE]";
      }
      return "text-gray-400 border-gray-200";
    }
    
    if (index <= currentIndex) {
      return "text-primary border-primary";
    }
    return "text-gray-400 border-gray-200";
  };

  return (
    <div className="flex flex-col space-y-4 px-4 py-2 lg:hidden">
      {steps.map((step, index) => (
        <div key={step.status} className="relative">
          {index < steps.length - 1 && (
            <div 
              className={cn(
                "absolute left-6 top-10 w-0.5 h-10",
                index < currentIndex ? "bg-primary" : "bg-gray-200",
                variant === 'client' && index < currentIndex && "bg-[#0FA0CE]"
              )}
            />
          )}
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-12 h-12 rounded-full border-2 flex items-center justify-center",
              getStepColor(index)
            )}>
              <step.icon className="w-6 h-6" />
            </div>
            <span className={cn(
              "font-medium",
              getStepColor(index)
            )}>
              {step.label}
            </span>
            {index === currentIndex && (
              <span className="text-sm text-muted-foreground ml-2">
                (En cours)
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}