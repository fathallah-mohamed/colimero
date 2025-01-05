import { BookingDetailsProps } from "@/types/booking";
import { SenderRecipientSection } from "./sections/SenderRecipientSection";
import { LocationSection } from "./sections/LocationSection";
import { DatesSection } from "./sections/DatesSection";
import { CarrierSection } from "./sections/CarrierSection";
import { SpecialItemsSection } from "./sections/SpecialItemsSection";

export function BookingDetails({ booking }: BookingDetailsProps) {
  return (
    <div className="mt-4 space-y-6 border-t pt-4">
      <SenderRecipientSection
        senderName={booking.sender_name}
        senderPhone={booking.sender_phone}
        recipientName={booking.recipient_name}
        recipientPhone={booking.recipient_phone}
        recipientAddress={booking.recipient_address}
      />

      <LocationSection
        pickupCity={booking.pickup_city}
        deliveryCity={booking.delivery_city}
        weight={booking.weight}
        trackingNumber={booking.tracking_number}
      />

      <DatesSection
        collectionDate={booking.tours?.collection_date}
        departureDate={booking.tours?.departure_date}
      />

      <CarrierSection
        carrierName={booking.tours?.carriers?.company_name}
        carrierPhone={booking.tours?.carriers?.phone}
        carrierAvatar={booking.tours?.carriers?.avatar_url}
      />

      <SpecialItemsSection
        specialItems={booking.special_items || []}
        contentTypes={booking.content_types || []}
      />

      {booking.package_description && (
        <div>
          <p className="text-sm text-gray-500">Description du colis</p>
          <p className="text-sm">{booking.package_description}</p>
        </div>
      )}
    </div>
  );
}