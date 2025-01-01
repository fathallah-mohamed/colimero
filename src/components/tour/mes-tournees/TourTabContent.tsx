import { TourList } from "./TourList";
import { EmptyTourState } from "./EmptyTourState";
import { TabsContent } from "@/components/ui/tabs";

interface TourTabContentProps {
  value: "upcoming" | "completed";
  onEdit: (tour: any) => void;
  onDelete: (tourId: number) => void;
  onStatusChange: (tourId: number, newStatus: string) => void;
}

export function TourTabContent({ 
  value,
  onEdit,
  onDelete,
  onStatusChange
}: TourTabContentProps) {
  return (
    <TabsContent value={value}>
      <div className="grid gap-6">
        <TourList
          status={value}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
        <EmptyTourState type={value} />
      </div>
    </TabsContent>
  );
}