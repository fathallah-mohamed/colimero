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
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <div>
          Capacité utilisée : {usedCapacity} kg
        </div>
        <div>
          Capacité disponible : {remainingCapacity} kg
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-gray-300"
          style={{ width: `${100 - remainingPercentage}%` }}
        />
        <div
          className={`h-full ${getColorClass(remainingPercentage)}`}
          style={{ width: `${remainingPercentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 text-center">
        Capacité totale : {totalCapacity} kg
      </div>
    </div>
  );
}