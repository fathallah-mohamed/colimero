import { useMemo } from "react";

interface TourCapacityDisplayProps {
  remainingCapacity: number;
  totalCapacity: number;
}

export function TourCapacityDisplay({ remainingCapacity, totalCapacity }: TourCapacityDisplayProps) {
  const percentageAvailable = useMemo(() => {
    return (remainingCapacity / totalCapacity) * 100;
  }, [remainingCapacity, totalCapacity]);

  // Determine color based on available capacity
  const progressColor = useMemo(() => {
    if (percentageAvailable > 70) return "bg-green-500"; // Beaucoup de capacité disponible
    if (percentageAvailable > 30) return "bg-orange-500"; // Capacité moyenne
    return "bg-red-500"; // Peu de capacité disponible
  }, [percentageAvailable]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
        <div className="space-y-1">
          <span className="text-sm text-gray-500">Capacité disponible</span>
          <p className={`text-lg font-medium ${
            percentageAvailable > 70 ? "text-green-600" : 
            percentageAvailable > 30 ? "text-orange-600" : 
            "text-red-600"
          }`}>
            {remainingCapacity} kg
          </p>
        </div>
        <div className="text-right space-y-1">
          <span className="text-sm text-gray-500">Capacité totale</span>
          <p className="text-lg font-medium">{totalCapacity} kg</p>
        </div>
      </div>
      
      <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full ${progressColor} rounded-full transition-all`}
          style={{
            width: `${percentageAvailable}%`,
          }}
        />
      </div>
      <p className="text-sm text-center text-gray-500">
        {Math.round(percentageAvailable)}% de capacité disponible
      </p>
    </div>
  );
}