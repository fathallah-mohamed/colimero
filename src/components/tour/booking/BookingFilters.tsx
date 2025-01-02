import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BookingStatus } from "@/types/booking";

interface BookingFiltersProps {
  cities: string[];
  onCityChange: (city: string) => void;
  onStatusChange: (status: BookingStatus) => void;
  onSortChange: (sort: string) => void;
  selectedCity: string;
  selectedStatus: BookingStatus | '';
  selectedSort: string;
}

export function BookingFilters({
  cities,
  onCityChange,
  onStatusChange,
  onSortChange,
  selectedCity,
  selectedStatus,
  selectedSort
}: BookingFiltersProps) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="flex-1">
        <Select value={selectedCity} onValueChange={onCityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les villes</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Select value={selectedStatus} onValueChange={(value) => onStatusChange(value as BookingStatus)}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="accepted">Acceptée</SelectItem>
            <SelectItem value="rejected">Refusée</SelectItem>
            <SelectItem value="collected">Collectée</SelectItem>
            <SelectItem value="in_transit">En transit</SelectItem>
            <SelectItem value="delivered">Livrée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Date (récent → ancien)</SelectItem>
            <SelectItem value="date_asc">Date (ancien → récent)</SelectItem>
            <SelectItem value="city_asc">Ville (A → Z)</SelectItem>
            <SelectItem value="city_desc">Ville (Z → A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}