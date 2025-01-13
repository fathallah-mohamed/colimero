import { Loader2 } from "lucide-react";
import { TourFilters } from "./TourFilters";
import { ToursList } from "./ToursList";
import { TourEditDialog } from "./TourEditDialog";
import { useTours } from "@/hooks/use-tours";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TourContentProps {
  carrierOnly?: boolean;
}

export function TourContent({ carrierOnly = false }: TourContentProps) {
  const {
    loading,
    tours,
    selectedTour,
    isEditDialogOpen,
    departureCountry,
    destinationCountry,
    sortBy,
    status,
    setDepartureCountry,
    setDestinationCountry,
    setSortBy,
    setStatus,
    setIsEditDialogOpen,
    handleDelete,
    handleEdit,
    handleStatusChange,
    onEditComplete
  } = useTours(carrierOnly);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const toursList = Array.isArray(tours) ? tours : [];

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <TourFilters
            departureCountry={departureCountry}
            destinationCountry={destinationCountry}
            sortBy={sortBy}
            status={status}
            onDepartureCountryChange={setDepartureCountry}
            onDestinationCountryChange={setDestinationCountry}
            onSortByChange={setSortBy}
            onStatusChange={setStatus}
          />
        </div>

        <ToursList
          tours={toursList}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
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