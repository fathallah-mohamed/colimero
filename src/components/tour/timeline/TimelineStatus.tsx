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
  variant?: 'client' | 'carrier';
}

export function TimelineStatus({
  status,
  isCompleted,
  isCurrent,
  isNext,
  onClick,
  label,
  variant = 'carrier'
}: TimelineStatusProps) {
  const getStatusColor = () => {
    if (variant === 'client') {
      if (isCompleted || isCurrent) {
        return "bg-[#0FA0CE] shadow-lg shadow-[#0FA0CE]/20 text-white hover:bg-[#0FA0CE]/90";
      }
      return "bg-white border-2 border-gray-100 hover:border-gray-200 shadow-lg shadow-gray-100/50";
    }
    
    return cn(
      "relative h-14 w-14 rounded-full p-0 transition-all duration-300",
      (isCompleted || status === "Livraison terminée") && "bg-primary shadow-lg shadow-primary/20 text-white hover:bg-primary/90",
      isCurrent && "bg-primary shadow-lg shadow-primary/20 text-white hover:bg-primary/90",
      !isCompleted && !isCurrent && status !== "Livraison terminée" && "bg-white border-2 border-gray-100 hover:border-gray-200 shadow-lg shadow-gray-100/50"
    );
  };

  const getTextColor = () => {
    if (variant === 'client') {
      if (isCompleted || isCurrent) {
        return "text-[#0FA0CE]";
      }
      return "text-gray-500";
    }
    
    return cn(
      "text-sm font-medium transition-colors duration-300",
      (isCompleted || status === "Livraison terminée") && "text-primary",
      isCurrent && "text-primary",
      !isCompleted && !isCurrent && status !== "Livraison terminée" && "text-gray-500"
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 relative">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          className={cn(
            "relative h-14 w-14 rounded-full p-0 transition-all duration-300",
            getStatusColor(),
            isNext && "hover:scale-105 transition-transform"
          )}
          onClick={onClick}
          disabled={!isNext}
        >
          <TimelineIcon 
            status={status} 
            isCompleted={isCompleted || status === "Livraison terminée"}
            isCurrent={isCurrent}
            variant={variant}
          />
        </Button>
      </motion.div>
      <div className="flex flex-col items-center gap-1">
        <span className={getTextColor()}>
          {label}
        </span>
        {isCurrent && (
          <span className="text-xs text-muted-foreground">
            En cours
          </span>
        )}
      </div>
    </div>
  );
}