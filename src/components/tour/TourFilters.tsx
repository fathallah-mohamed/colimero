import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TourStatus } from "@/types/tour";

interface TourFiltersProps {
  departureCountry: string;
  destinationCountry: string;
  sortBy: string;
  status: TourStatus | "all";
  onDepartureCountryChange: (value: string) => void;
  onDestinationCountryChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onStatusChange: (value: TourStatus | "all") => void;
}

export function TourFilters({
  departureCountry,
  destinationCountry,
  sortBy,
  status,
  onDepartureCountryChange,
  onDestinationCountryChange,
  onSortByChange,
  onStatusChange,
}: TourFiltersProps) {
  return (
    <div className="flex gap-3 items-center">
      <div className="w-40">
        <Select value={departureCountry} onValueChange={onDepartureCountryChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Pays de départ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FR">France</SelectItem>
            <SelectItem value="TN">Tunisie</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-40">
        <Select value={destinationCountry} onValueChange={onDestinationCountryChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Pays de destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FR">France</SelectItem>
            <SelectItem value="TN">Tunisie</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-48">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Programmée">Programmée</SelectItem>
            <SelectItem value="Ramassage en cours">Ramassage en cours</SelectItem>
            <SelectItem value="En transit">En transit</SelectItem>
            <SelectItem value="Livraison en cours">Livraison en cours</SelectItem>
            <SelectItem value="Terminée">Terminée</SelectItem>
            <SelectItem value="Annulée">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-52">
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="departure_asc">Date de départ (croissant)</SelectItem>
            <SelectItem value="departure_desc">Date de départ (décroissant)</SelectItem>
            <SelectItem value="created_asc">Date de création (croissant)</SelectItem>
            <SelectItem value="created_desc">Date de création (décroissant)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}