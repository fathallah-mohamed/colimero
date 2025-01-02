import { Loader2 } from "lucide-react";
import { TourFilters } from "./TourFilters";
import { TourTabs } from "./TourTabs";
import { TourEditDialog } from "./TourEditDialog";
import { useTours } from "@/hooks/use-tours";

export function TourContent() {
  const {
    loading,
    tours,
    selectedTour,
    isEditDialogOpen,
    departureCountry,
    destinationCountry,
    sortBy,
    setDepartureCountry,
    setDestinationCountry,
    setSortBy,
    setIsEditDialogOpen,
    handleDelete,
    handleEdit,
    handleStatusChange,
    onEditComplete
  } = useTours();

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const upcomingTours = tours.filter(tour => tour.status !== 'completed');
  const completedTours = tours.filter(tour => tour.status === 'completed');

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <TourFilters
          departureCountry={departureCountry}
          destinationCountry={destinationCountry}
          sortBy={sortBy}
          onDepartureChange={setDepartureCountry}
          onDestinationChange={setDestinationCountry}
          onSortChange={setSortBy}
        />
      </div>

      <TourTabs
        upcomingTours={upcomingTours}
        completedTours={completedTours}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <TourEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        tour={selectedTour}
        onComplete={onEditComplete}
      />
    </div>
  );
}