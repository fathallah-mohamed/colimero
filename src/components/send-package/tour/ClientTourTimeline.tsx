import { Tour } from "@/types/tour";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Truck } from "lucide-react";

interface ClientTourTimelineProps {
  tour: Tour;
}

export function ClientTourTimeline({ tour }: ClientTourTimelineProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Points de collecte</h4>
      <div className="relative">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
        {tour.route?.map((stop, index) => (
          <div key={index} className="relative pl-8 pb-6 last:pb-0">
            <div className="absolute left-0 w-4 h-4 rounded-full bg-white border-2 border-[#8B5CF6]" />
            <div className="space-y-1">
              <p className="font-medium">{stop.name}</p>
              <p className="text-sm text-gray-600">{stop.location}</p>
              <p className="text-sm text-gray-600">{stop.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}