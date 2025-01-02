interface TourCapacityDisplayProps {
  remainingCapacity: number;
  totalCapacity: number;
}

export function TourCapacityDisplay({ remainingCapacity, totalCapacity }: TourCapacityDisplayProps) {
  const usedCapacity = totalCapacity - remainingCapacity;
  const remainingPercentage = (remainingCapacity / totalCapacity) * 100;
  
  const getColorClass = (percentage: number) => {
    if (percentage >= 70) return "bg-green-500";
    if (percentage >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-900">Capacité de la tournée</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-sm">
          <p className="text-gray-500">Espace utilisé</p>
          <p className="font-medium text-gray-900">{usedCapacity} kg</p>
        </div>
        <div className="text-sm">
          <p className="text-gray-500">Espace disponible</p>
          <p className="font-medium text-gray-900">{remainingCapacity} kg</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Points de ramassage</span>
          <span>{Math.round(remainingPercentage)}% disponible</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${getColorClass(remainingPercentage)}`}
            style={{ width: `${remainingPercentage}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-center text-gray-500">
        Capacité totale de la tournée : {totalCapacity} kg
      </p>
    </div>
  );
}