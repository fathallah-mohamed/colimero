import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import type { Tour } from "@/types/tour";

interface TourListProps {
  tourType: string;
  publicTours: Tour[];
  privateTours: Tour[];
  isLoadingPublic: boolean;
  isLoadingPrivate: boolean;
  userType: string | null;
}

export function TourList({ 
  tourType, 
  publicTours, 
  privateTours, 
  isLoadingPublic, 
  isLoadingPrivate,
  userType 
}: TourListProps) {
  return tourType === "public" ? (
    <TransporteurTours 
      tours={publicTours} 
      type="public"
      isLoading={isLoadingPublic}
      userType={userType}
    />
  ) : (
    <TransporteurTours 
      tours={privateTours} 
      type="private"
      isLoading={isLoadingPrivate}
      userType={userType}
    />
  );
}