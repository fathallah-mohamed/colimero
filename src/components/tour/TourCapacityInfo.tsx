import { Progress } from "@/components/ui/progress";

interface TourCapacityInfoProps {
  totalCapacity: number;
  remainingCapacity: number;
  bookingsCount: number;
}

export function TourCapacityInfo({ 
  totalCapacity, 
  remainingCapacity,
  bookingsCount 
}: TourCapacityInfoProps) {
  const usedCapacity = totalCapacity - remainingCapacity;
  const usedPercentage = (usedCapacity / totalCapacity) * 100;

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          Capacité utilisée: {usedCapacity} kg / {totalCapacity} kg
        </div>
        <div className="text-sm text-gray-500">
          {bookingsCount} réservation{bookingsCount > 1 ? 's' : ''}
        </div>
      </div>
      
      <Progress 
        value={usedPercentage} 
        className="h-2 bg-gray-200"
      />
      
      <div className="text-sm text-gray-500">
        Capacité restante: {remainingCapacity} kg
      </div>
    </div>
  );
}