import { XCircle } from "lucide-react";

export function CancelledStatus() {
  return (
    <div className="flex items-center justify-center w-full py-12">
      <div className="flex flex-col items-center gap-4">
        <XCircle className="h-16 w-16 text-red-500" />
        <span className="text-lg font-medium text-red-500">
          Commande annulée
        </span>
      </div>
    </div>
  );
}