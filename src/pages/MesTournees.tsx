import Navigation from "@/components/Navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourEditDialog } from "@/components/tour/TourEditDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToursList } from "@/components/tour/ToursList";
import { TourFilters } from "@/components/tour/TourFilters";
import { useTours } from "@/hooks/use-tours";
import { useNavigate } from "react-router-dom";

export default function MesTournees() {
  const navigate = useNavigate();
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

  const upcomingTours = tours.filter(tour => tour.status !== 'completed');
  const completedTours = tours.filter(tour => tour.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Mes tournées</h1>
          <Button onClick={() => navigate('/planifier-une-tournee')}>
            Créer une nouvelle tournée
          </Button>
        </div>

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

          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Tournées à venir</TabsTrigger>
              <TabsTrigger value="completed">Tournées terminées</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              <ToursList
                tours={upcomingTours}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <ToursList
                tours={completedTours}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                isCompleted={true}
              />
            </TabsContent>
          </Tabs>
        </div>

        <TourEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          tour={selectedTour}
          onComplete={onEditComplete}
        />
      </div>
    </div>
  );
}