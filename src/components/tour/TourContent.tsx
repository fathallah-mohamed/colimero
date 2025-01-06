import { Loader2 } from "lucide-react";
import { TourFilters } from "./TourFilters";
import { TourTabs } from "./TourTabs";
import { TourEditDialog } from "./TourEditDialog";
import { useTours } from "@/hooks/use-tours";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TourContent() {
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
  } = useTours();

  console.log('TourContent rendered with tours:', tours);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const upcomingTours = tours.filter(tour => 
    !['completed_completed', 'cancelled'].includes(tour.status)
  );
  const completedTours = tours.filter(tour => 
    ['completed_completed', 'cancelled'].includes(tour.status)
  );

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <TourFilters
            departureCountry={departureCountry}
            destinationCountry={destinationCountry}
            sortBy={sortBy}
            status={status}
            onDepartureChange={setDepartureCountry}
            onDestinationChange={setDestinationCountry}
            onSortChange={setSortBy}
            onStatusChange={setStatus}
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
    </ScrollArea>
  );
}