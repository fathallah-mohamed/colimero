import { Calendar, Package, Truck, MapPin } from "lucide-react";

interface TourStatusTimelineProps {
  status: string;
  onStatusChange: (newStatus: string) => void;
}

export function TourStatusTimeline({ status, onStatusChange }: TourStatusTimelineProps) {
  const statuses = [
    { code: 'planned', label: 'Planifiée', icon: Calendar },
    { code: 'collecting', label: 'Collecte', icon: Package },
    { code: 'in_transit', label: 'Livraison', icon: Truck },
    { code: 'completed', label: 'Terminée', icon: MapPin },
  ];

  const currentIndex = statuses.findIndex(s => s.code === status);

  return (
    <div className="flex justify-between items-center w-full mt-4">
      {statuses.map((s, index) => {
        const Icon = s.icon;
        const isActive = index <= currentIndex && status !== 'cancelled';
        const isClickable = index === currentIndex + 1 && status !== 'cancelled' && status !== 'completed';

        return (
          <div
            key={s.code}
            className={`flex-1 flex flex-col items-center ${
              isClickable ? 'cursor-pointer' : ''
            }`}
            onClick={() => isClickable && onStatusChange(s.code)}
          >
            <div
              className={`rounded-full p-4 ${
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <span className={`mt-2 text-sm ${
              isActive ? 'text-primary' : 'text-gray-400'
            }`}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}