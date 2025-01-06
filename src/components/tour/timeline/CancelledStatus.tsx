import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

export function CancelledStatus() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center w-full py-8"
    >
      <div className="flex flex-col items-center bg-destructive/10 p-8 rounded-2xl">
        <XCircle className="h-16 w-16 text-destructive mb-4" />
        <span className="text-lg font-medium text-destructive">
          Tournée annulée
        </span>
        <p className="text-sm text-destructive/80 mt-2 text-center">
          Cette tournée n'est plus disponible pour les réservations
        </p>
      </div>
    </motion.div>
  );
}