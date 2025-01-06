import { cn } from "@/lib/utils";

interface TimelineProgressProps {
  progress: number;
}

export function TimelineProgress({ progress }: TimelineProgressProps) {
  return (
    <div className="absolute left-0 right-0 top-6 h-[2px] -z-10">
      <div className="h-full bg-gray-200 rounded-full">
        <div 
          className={cn(
            "h-full bg-primary rounded-full transition-all duration-500",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}