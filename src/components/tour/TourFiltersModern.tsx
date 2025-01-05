import { ArrowLeftRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TourStatus } from "@/types/tour";

interface TourFiltersModernProps {
  departureCountry: string;
  destinationCountry: string;
  sortBy: string;
  status: TourStatus | "all";
  onDepartureChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onStatusChange: (value: TourStatus | "all") => void;
}

const countryNames: { [key: string]: string } = {
  'FR': 'France',
  'TN': 'Tunisie',
  'DZ': 'Algérie',
  'MA': 'Maroc'
};

export function TourFiltersModern({
  departureCountry,
  destinationCountry,
  sortBy,
  status,
  onDepartureChange,
  onDestinationChange,
  onSortChange,
  onStatusChange,
}: TourFiltersModernProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4 bg-white p-4 rounded-lg shadow-sm">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Pays de départ
        </label>
        <Select value={departureCountry} onValueChange={onDepartureChange}>
          <SelectTrigger>
            <SelectValue placeholder="Pays de départ" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(countryNames).map(([code, name]) => (
              <SelectItem key={code} value={code}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-center pt-6">
        <ArrowLeftRight className="h-5 w-5 text-gray-400" />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Pays de destination
        </label>
        <Select value={destinationCountry} onValueChange={onDestinationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Pays de destination" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(countryNames).map(([code, name]) => (
              <SelectItem key={code} value={code}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Trier par
        </label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="departure_asc">Date (plus tôt → plus tard)</SelectItem>
            <SelectItem value="departure_desc">Date (plus tard → plus tôt)</SelectItem>
            <SelectItem value="capacity_asc">Capacité (croissant)</SelectItem>
            <SelectItem value="capacity_desc">Capacité (décroissant)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}