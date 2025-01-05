import { TourFilters } from "@/components/tour/TourFilters";
import { TourTypeTabs } from "@/components/tour/TourTypeTabs";
import type { TourStatus } from "@/types/tour";

interface TourFiltersSectionProps {
  departureCountry: string;
  destinationCountry: string;
  tourType: string;
  sortBy: string;
  status: TourStatus | "all";
  publicToursCount: number;
  privateToursCount: number;
  onDepartureChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onStatusChange: (value: TourStatus | "all") => void;
}

export function TourFiltersSection({
  departureCountry,
  destinationCountry,
  tourType,
  sortBy,
  status,
  publicToursCount,
  privateToursCount,
  onDepartureChange,
  onDestinationChange,
  onTypeChange,
  onSortChange,
  onStatusChange,
}: TourFiltersSectionProps) {
  return (
    <div className="space-y-6">
      <TourFilters
        departureCountry={departureCountry}
        destinationCountry={destinationCountry}
        sortBy={sortBy}
        status={status}
        onDepartureChange={onDepartureChange}
        onDestinationChange={onDestinationChange}
        onSortChange={onSortChange}
        onStatusChange={onStatusChange}
      />

      <TourTypeTabs
        tourType={tourType}
        publicToursCount={publicToursCount}
        privateToursCount={privateToursCount}
        onTypeChange={onTypeChange}
      />
    </div>
  );
}