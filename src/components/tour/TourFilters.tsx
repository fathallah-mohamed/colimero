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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Pays de départ
        </label>
        <Select value={departureCountry} onValueChange={onDepartureCountryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Pays de départ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FR">France</SelectItem>
            <SelectItem value="TN">Tunisie</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Pays de destination
        </label>
        <Select value={destinationCountry} onValueChange={onDestinationCountryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Pays de destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FR">France</SelectItem>
            <SelectItem value="TN">Tunisie</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Statut
        </label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
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

      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Trier par
        </label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger>
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