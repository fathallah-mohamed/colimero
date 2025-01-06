import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

export function CancelledStatus() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center w-full py-6"
    >
      <div className="flex flex-col items-center">
        <XCircle className="h-16 w-16 text-red-500" />
        <span className="text-lg mt-4 text-red-500 font-medium">
          Tournée annulée
        </span>
      </div>
    </motion.div>
  );
}