import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TimelineProgressProps {
  progress: number;
}

export function TimelineProgress({ progress }: TimelineProgressProps) {
  return (
    <>
      <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full -z-10" />
      <motion.div 
        className="absolute top-6 left-0 h-1 bg-primary rounded-full -z-10"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </>
  );
}