import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight } from "lucide-react";

interface TourHeaderProps {
  tour: any;
}

const countryNames: { [key: string]: string } = {
  'FR': 'France',
  'TN': 'Tunisie',
  'DZ': 'Algérie',
  'MA': 'Maroc'
};

const countryFlags: { [key: string]: string } = {
  'FR': '🇫🇷',
  'TN': '🇹🇳',
  'DZ': '🇩🇿',
  'MA': '🇲🇦'
};

export function TourHeader({ tour }: TourHeaderProps) {
  const getDepartureCity = () => {
    if (!tour.route || !Array.isArray(tour.route)) return null;
    const pickupPoints = tour.route.filter((point: any) => point.type === 'pickup');
    return pickupPoints[pickupPoints.length - 1]?.name;
  };

  const departureCity = getDepartureCity();

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="flex items-center">
            <span className="text-xl mr-1">{countryFlags[tour.departure_country]}</span>
            {countryNames[tour.departure_country]}
          </span>
          <ArrowRight className="h-5 w-5 text-primary mx-1 stroke-2" />
          <span className="flex items-center">
            <span className="text-xl mr-1">{countryFlags[tour.destination_country]}</span>
            {countryNames[tour.destination_country]}
          </span>
        </h2>
        <Badge variant={tour.type === 'public' ? 'default' : 'secondary'}>
          {tour.type === 'public' ? 'Publique' : 'Privée'}
        </Badge>
      </div>
      <p className="text-gray-600 mb-1">
        Départ : {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
      </p>
      {departureCity && (
        <p className="text-gray-600 mb-1">
          Ville de départ : {departureCity}
        </p>
      )}
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