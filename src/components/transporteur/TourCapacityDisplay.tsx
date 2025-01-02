interface TourCapacityDisplayProps {
  totalCapacity: number;
  remainingCapacity: number;
}

export function TourCapacityDisplay({ totalCapacity, remainingCapacity }: TourCapacityDisplayProps) {
  const usedCapacity = totalCapacity - remainingCapacity;
  const remainingPercentage = (remainingCapacity / totalCapacity) * 100;

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="space-y-4">
        {/* Informations de capacité */}
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-900">Capacité disponible :</span>
            <span className="font-medium text-slate-900 ml-1">{remainingCapacity} kg</span>
          </div>
          <div>
            <span className="text-slate-900">Capacité occupée :</span>
            <span className="font-medium text-slate-900 ml-1">{usedCapacity} kg</span>
          </div>
        </div>

        {/* Barre de progression */}
        <div>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all bg-emerald-500"
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
        </div>

        {/* Capacité totale */}
        <div className="text-sm text-center">
          <span className="text-slate-900">Capacité totale du camion : </span>
          <span className="font-medium text-slate-900">{totalCapacity} kg</span>
        </div>
      </div>
    </div>
  );
}