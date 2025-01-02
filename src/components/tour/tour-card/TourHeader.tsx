import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TourHeaderProps {
  tour: any;
}

const countryNames: { [key: string]: string } = {
  'FR': 'France',
  'TN': 'Tunisie',
  'DZ': 'Algérie',
  'MA': 'Maroc'
};

export function TourHeader({ tour }: TourHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-lg font-semibold">
          {countryNames[tour.departure_country]} → {countryNames[tour.destination_country]}
        </h2>
        <Badge variant={tour.type === 'public' ? 'default' : 'secondary'}>
          {tour.type === 'public' ? 'Public' : 'Privée'}
        </Badge>
      </div>
      <p className="text-gray-600 mb-1">
        Départ : {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
      </p>
      <div className="flex items-center gap-4">
        <p className="text-gray-600">
          Capacité restante : {tour.remaining_capacity} kg
        </p>
        <p className="text-gray-600">
          Total : {tour.total_capacity} kg
        </p>
      </div>
    </div>
  );
}