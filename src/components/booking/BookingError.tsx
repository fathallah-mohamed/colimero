import { AlertCircle } from "lucide-react";

interface BookingErrorProps {
  title: string;
  description: string;
}

export function BookingError({ title, description }: BookingErrorProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500">
        {description}
      </p>
    </div>
  );
}