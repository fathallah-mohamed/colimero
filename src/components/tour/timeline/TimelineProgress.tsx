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
      <div className="flex-1 flex justify-between">
        {[0, 1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-2 w-2 rounded-full ${
              (progress / 100) * 4 > step ? "bg-[#34D399]" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}