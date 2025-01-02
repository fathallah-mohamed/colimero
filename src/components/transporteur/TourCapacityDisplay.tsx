interface TourCapacityDisplayProps {
  totalCapacity: number;
  remainingCapacity: number;
}

export function TourCapacityDisplay({ totalCapacity, remainingCapacity }: TourCapacityDisplayProps) {
  const usedCapacity = totalCapacity - remainingCapacity;
  const remainingPercentage = (remainingCapacity / totalCapacity) * 100;

  const getColorClass = (percentage: number) => {
    if (percentage > 60) return "bg-emerald-500";
    if (percentage > 30) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="space-y-4">
        {/* Informations de capacité */}
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-600">Capacité occupée :</span>
            <span className="font-medium text-slate-900 ml-1">{usedCapacity} kg</span>
          </div>
          <div>
            <span className="text-slate-600">Disponible :</span>
            <span className="font-medium text-slate-900 ml-1">{remainingCapacity} kg</span>
          </div>
        </div>

        {/* Barre de progression */}
        <div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getColorClass(remainingPercentage)}`}
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
        </div>

        {/* Capacité totale */}
        <div className="text-xs text-center text-slate-500">
          Capacité totale : {totalCapacity} kg
        </div>
      </div>
    </div>
  );
}