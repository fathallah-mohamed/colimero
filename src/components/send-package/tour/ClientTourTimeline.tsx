import { Tour } from "@/types/tour";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientTourTimelineProps {
  tour: Tour;
}

export function ClientTourTimeline({ tour }: ClientTourTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Dates</p>
            <p className="text-sm font-medium">
              {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Trajet</p>
            <p className="text-sm font-medium">
              {tour.departure_country} → {tour.destination_country}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Transporteur</p>
            <p className="text-sm font-medium">
              {tour.carriers?.company_name}
            </p>
          </div>
        </div>
      </div>

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

      <Button 
        className="w-full bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white mt-6"
      >
        Réserver
      </Button>
    </div>
  );
}