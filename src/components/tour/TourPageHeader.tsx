import { TourFilters } from "./TourFilters";
import { TourTypeTabs } from "./TourTypeTabs";
import type { TourStatus } from "@/types/tour";

interface TourPageHeaderProps {
  departureCountry: string;
  destinationCountry: string;
  tourType: string;
  sortBy: string;
  status: TourStatus | "all";
  publicToursCount: number;
  privateToursCount: number;
  onDepartureChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onStatusChange: (value: TourStatus | "all") => void;
  onTypeChange: (value: string) => void;
}

export function TourPageHeader({
  departureCountry,
  destinationCountry,
  tourType,
  sortBy,
  status,
  publicToursCount,
  privateToursCount,
  onDepartureChange,
  onDestinationChange,
  onSortChange,
  onStatusChange,
  onTypeChange,
}: TourPageHeaderProps) {
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