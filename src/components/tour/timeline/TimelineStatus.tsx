import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TourStatus } from "@/types/tour";
import { TimelineIcon } from "./TimelineIcon";
import { motion } from "framer-motion";

interface TimelineStatusProps {
  status: TourStatus;
  isCompleted: boolean;
  isCurrent: boolean;
  isNext: boolean;
  onClick: () => void;
  label: string;
}

export function TimelineStatus({
  status,
  isCompleted,
  isCurrent,
  isNext,
  onClick,
  label
}: TimelineStatusProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          className={cn(
            "relative h-14 w-14 rounded-full p-0 transition-all duration-300",
            (isCompleted || status === "Livraison terminée") && "bg-[#34D399] border-none text-white hover:bg-[#34D399]/90",
            isCurrent && "bg-[#34D399] border-none text-white hover:bg-[#34D399]/90",
            !isCompleted && !isCurrent && status !== "Livraison terminée" && "border-2 border-gray-200 hover:border-gray-300",
            isNext && "animate-pulse"
          )}
          onClick={onClick}
          disabled={!isNext}
        >
          <TimelineIcon 
            status={status} 
            isCompleted={isCompleted || status === "Livraison terminée"}
            isCurrent={isCurrent}
          />
        </Button>
      </motion.div>
      <span className={cn(
        "text-sm font-medium transition-colors duration-300 text-center",
        (isCompleted || status === "Livraison terminée") && "text-[#34D399]",
        isCurrent && "text-[#34D399]",
        !isCompleted && !isCurrent && status !== "Livraison terminée" && "text-gray-500"
      )}>
        {label}
      </span>
    </div>
  );
}