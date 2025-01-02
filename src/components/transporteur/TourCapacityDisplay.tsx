interface TourCapacityDisplayProps {
  totalCapacity: number;
  remainingCapacity: number;
}

export function TourCapacityDisplay({ totalCapacity, remainingCapacity }: TourCapacityDisplayProps) {
  const usedCapacity = totalCapacity - remainingCapacity;
  const remainingPercentage = (remainingCapacity / totalCapacity) * 100;

  const getColorClass = (percentage: number) => {
    if (percentage > 60) return "bg-green-500";
    if (percentage > 30) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4 bg-white border rounded-lg">
      <div className="space-y-4">
        {/* Barre de progression simple */}
        <div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getColorClass(remainingPercentage)}`}
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
        </div>

        {/* Information simple et claire */}
        <div className="text-sm text-center space-y-1">
          <p className="text-gray-600">
            Espace disponible : <span className="font-medium text-gray-900">{remainingCapacity} kg</span>
          </p>
          <p className="text-xs text-gray-500">
            sur {totalCapacity} kg au total
          </p>
        </div>
      </div>
    </div>
  );
}