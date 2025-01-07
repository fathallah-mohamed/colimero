import { motion } from "framer-motion";

interface TimelineProgressProps {
  progress: number;
}

export function TimelineProgress({ progress }: TimelineProgressProps) {
  return (
    <motion.div 
      className="absolute top-1/2 left-0 w-full flex items-center justify-between px-4 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="timeline-progress w-full">
        <div 
          className="timeline-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}