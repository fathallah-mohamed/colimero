import { FC } from 'react';
import { TourFilters } from '@/components/tour/TourFilters';
import { TourTypeTabs } from '@/components/tour/TourTypeTabs';
import { TransporteurTours } from '@/components/transporteur/TransporteurTours';
import { Tour, TourStatus } from '@/types/tour';

interface TourPageContentProps {
  departureCountry: string;
  destinationCountry: string;
  sortBy: string;
  status: TourStatus | "all";
  tourType: string;
  publicTours: Tour[];
  privateTours: Tour[];
  isLoadingPublic: boolean;
  isLoadingPrivate: boolean;
  userType: string | null;
  onDepartureChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onStatusChange: (value: TourStatus | "all") => void;
  onTypeChange: (value: string) => void;
  onAuthRequired: () => void;
}

const TourPageContent: FC<TourPageContentProps> = ({
  departureCountry,
  destinationCountry,
  sortBy,
  status,
  tourType,
  publicTours,
  privateTours,
  isLoadingPublic,
  isLoadingPrivate,
  userType,
  onDepartureChange,
  onDestinationChange,
  onSortChange,
  onStatusChange,
  onTypeChange,
  onAuthRequired,
}) => {
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
        publicToursCount={publicTours?.length || 0}
        privateToursCount={privateTours?.length || 0}
        onTypeChange={onTypeChange}
      />

      {tourType === "public" ? (
        <TransporteurTours 
          tours={publicTours} 
          type="public"
          isLoading={isLoadingPublic}
          userType={userType}
          onAuthRequired={onAuthRequired}
          hideAvatar={false}
        />
      ) : (
        <TransporteurTours 
          tours={privateTours} 
          type="private"
          isLoading={isLoadingPrivate}
          userType={userType}
          onAuthRequired={onAuthRequired}
          hideAvatar={false}
        />
      )}
    </div>
  );
};

export default TourPageContent;