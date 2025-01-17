import { Loader2 } from "lucide-react";
import { TourFilters } from "./TourFilters";
import { ToursList } from "./ToursList";
import { TourEditDialog } from "./TourEditDialog";
import { useTours } from "@/hooks/use-tours";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BookingStatus } from "@/types/booking";

interface TourContentProps {
  carrierOnly?: boolean;
}

export function TourContent({ carrierOnly = false }: TourContentProps) {
  const {
    loading,
    tours,
    selectedTour,
    isEditDialogOpen,
    selectedRoute,
    selectedStatus,
    sortBy,
    setSelectedRoute,
    setSelectedStatus,
    setSortBy,
    setIsEditDialogOpen,
    handleDelete,
    handleEdit,
    handleStatusChange,
    onEditComplete
  } = useTours(carrierOnly);

  // Create a wrapper function that adapts the signature
  const handleBookingStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    // Since this is for bookings, we don't need to do anything with tour status here
    return Promise.resolve();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Ensure tours is an array
  const toursList = Array.isArray(tours) ? tours : [];

  // Split the selectedRoute into departure and destination countries
  const [departureCountry, destinationCountry] = selectedRoute.split('_TO_');

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <TourFilters
            departureCountry={departureCountry}
            destinationCountry={destinationCountry}
            sortBy={sortBy}
            status={selectedStatus}
            onDepartureCountryChange={(country) => setSelectedRoute(`${country}_TO_${destinationCountry}`)}
            onDestinationCountryChange={(country) => setSelectedRoute(`${departureCountry}_TO_${country}`)}
            onSortByChange={setSortBy}
            onStatusChange={setSelectedStatus}
          />
        </div>

        <ToursList
          tours={toursList}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleBookingStatusChange}
        />

        {selectedTour && (
          <TourEditDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            tour={selectedTour}
            onComplete={onEditComplete}
          />
        )}
      </div>
    </ScrollArea>
  );
}