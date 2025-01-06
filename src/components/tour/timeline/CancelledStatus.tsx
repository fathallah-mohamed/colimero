import { XCircle } from "lucide-react";

export function CancelledStatus() {
  return (
    <div className="flex items-center justify-center w-full py-6">
      <div className="flex flex-col items-center">
        <XCircle className="h-12 w-12 text-red-500" />
        <span className="text-sm mt-2 text-red-500 font-medium">
          Tournée annulée
        </span>
      </div>
    </div>
  );
}