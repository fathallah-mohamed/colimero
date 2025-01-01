import { XCircle } from "lucide-react";

export function CancelledTimeline() {
  return (
    <div className="flex items-center justify-center w-full py-6">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-red-100 p-3 rounded-full">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <span className="text-sm font-medium text-red-500">Tournée annulée</span>
      </div>
    </div>
  );
}