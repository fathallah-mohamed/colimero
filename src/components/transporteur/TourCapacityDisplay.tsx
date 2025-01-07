interface TourCapacityDisplayProps {
  totalCapacity: number;
  remainingCapacity: number;
}

export function TourCapacityDisplay({ totalCapacity, remainingCapacity }: TourCapacityDisplayProps) {
  const occupiedCapacity = totalCapacity - remainingCapacity;
  const occupiedPercentage = (occupiedCapacity / totalCapacity) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Capacité disponible : {remainingCapacity} kg</span>
        <span>Capacité occupée : {occupiedCapacity} kg</span>
      </div>
      
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${occupiedPercentage}%` }}
        />
      </div>
      
      <div className="text-sm text-center text-gray-500">
        Capacité totale du camion : {totalCapacity} kg
      </div>
    </div>
  );
}