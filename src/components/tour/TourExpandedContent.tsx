import { Tour, TourStatus } from "@/types/tour";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { motion } from "framer-motion";
import { BookingSection } from "./booking/BookingSection";

interface TourExpandedContentProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  existingRequest?: any;
  userType?: string;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
}

export function TourExpandedContent({
  tour,
  selectedPickupCity,
  onPickupCitySelect,
  existingRequest,
  userType,
  onStatusChange
}: TourExpandedContentProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="pt-6 space-y-6">
        <ClientTimeline 
          status={tour.status} 
          tourId={tour.id}
          onStatusChange={onStatusChange}
        />

        <BookingSection
          tour={tour}
          selectedPickupCity={selectedPickupCity}
          onPickupCitySelect={onPickupCitySelect}
          existingRequest={existingRequest}
          userType={userType}
        />
      </div>
    </motion.div>
  );
}