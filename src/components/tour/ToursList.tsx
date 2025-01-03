import { TourCard } from "./TourCard";
import { TourEditDialog } from "./TourEditDialog";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ToursListProps {
  tours: any[];
  isCompleted?: boolean;
  onEdit: (tour: any) => void;
  onDelete: (tourId: number) => void;
  onStatusChange: (tourId: number, newStatus: string) => void;
}

export function ToursList({ 
  tours, 
  isCompleted, 
  onEdit, 
  onDelete, 
  onStatusChange 
}: ToursListProps) {
  const navigate = useNavigate();

  if (tours.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isCompleted ? "Aucune tournée terminée" : "Aucune tournée planifiée"}
        </h3>
        <p className="text-gray-500 mb-4">
          {isCompleted 
            ? "Les tournées terminées apparaîtront ici."
            : "Vous n'avez pas encore créé de tournée. Commencez par en planifier une !"}
        </p>
        {!isCompleted && (
          <Button onClick={() => navigate('/planifier-une-tournee')}>
            Planifier une tournée
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {tours.map((tour) => (
        <TourCard
          key={tour.id}
          tour={tour}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          isCompleted={isCompleted}
        />
      ))}
    </div>
  );
}