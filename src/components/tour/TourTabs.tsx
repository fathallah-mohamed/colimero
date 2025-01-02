import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToursList } from "./ToursList";

interface TourTabsProps {
  upcomingTours: any[];
  completedTours: any[];
  onEdit: (tour: any) => void;
  onDelete: (tourId: number) => void;
  onStatusChange: (tourId: number, newStatus: string) => void;
}

export function TourTabs({
  upcomingTours,
  completedTours,
  onEdit,
  onDelete,
  onStatusChange
}: TourTabsProps) {
  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upcoming">Tournées à venir</TabsTrigger>
        <TabsTrigger value="completed">Tournées terminées</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-6">
        <ToursList
          tours={upcomingTours}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      </TabsContent>

      <TabsContent value="completed" className="space-y-6">
        <ToursList
          tours={completedTours}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          isCompleted={true}
        />
      </TabsContent>
    </Tabs>
  );
}