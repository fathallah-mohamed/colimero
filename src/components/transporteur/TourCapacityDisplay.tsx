import { useMemo } from "react";

interface TourCapacityDisplayProps {
  remainingCapacity: number;
  totalCapacity: number;
}

export function TourCapacityDisplay({ remainingCapacity, totalCapacity }: TourCapacityDisplayProps) {
  const percentageAvailable = useMemo(() => {
    return (remainingCapacity / totalCapacity) * 100;
  }, [remainingCapacity, totalCapacity]);

  const usedCapacity = totalCapacity - remainingCapacity;
  const percentageUsed = useMemo(() => {
    return (usedCapacity / totalCapacity) * 100;
  }, [usedCapacity, totalCapacity]);

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
          <span className="text-sm text-gray-500">Capacité utilisée</span>
          <p className="text-lg font-medium text-gray-700">
            {usedCapacity} kg
          </p>
        </div>
        <div className="text-right space-y-1">
          <span className="text-sm text-gray-500">Capacité disponible</span>
          <p className={`text-lg font-medium ${
            percentageAvailable > 70 ? "text-green-600" : 
            percentageAvailable > 30 ? "text-orange-600" : 
            "text-red-600"
          }`}>
            {remainingCapacity} kg
          </p>
        </div>
      </div>
      
      <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
        {/* Barre de capacité utilisée */}
        <div
          className="absolute left-0 top-0 h-full bg-gray-300 transition-all"
          style={{
            width: `${percentageUsed}%`,
          }}
        />
        {/* Barre de capacité disponible */}
        <div
          className={`absolute right-0 top-0 h-full ${progressColor} transition-all`}
          style={{
            width: `${percentageAvailable}%`,
          }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span>Capacité totale: {totalCapacity} kg</span>
        <span>{Math.round(percentageAvailable)}% disponible</span>
      </div>
    </div>
  );
}