import { AlertCircle } from "lucide-react";

export function EmptyBookingList() {
  return (
    <div className="bg-white shadow rounded-lg p-6 text-center">
      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucune réservation
      </h3>
      <p className="text-gray-500">
        Vous n'avez pas encore effectué de réservation.
      </p>
    </div>
  );
}