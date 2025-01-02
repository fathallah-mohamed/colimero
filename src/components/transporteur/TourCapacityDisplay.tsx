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
        {/* Informations de capacité */}
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-600">Capacité occupée :</span>
            <span className="font-medium text-gray-900 ml-1">{usedCapacity} kg</span>
          </div>
          <div>
            <span className="text-gray-600">Disponible :</span>
            <span className="font-medium text-gray-900 ml-1">{remainingCapacity} kg</span>
          </div>
        </div>

        {/* Barre de progression */}
        <div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getColorClass(remainingPercentage)}`}
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
        </div>

        {/* Capacité totale */}
        <div className="text-xs text-center text-gray-500">
          Capacité totale : {totalCapacity} kg
        </div>
      </div>
    </div>
  );
}