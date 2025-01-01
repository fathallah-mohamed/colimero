import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TourStatusTimeline } from "./TourStatusTimeline";
import { TourBookingsList } from "./TourBookingsList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TourCardProps {
  tour: any;
  onEdit: (tour: any) => void;
  onDelete: (tourId: number) => void;
  onStatusChange: (tourId: number, newStatus: string) => void;
}

export function TourCard({ tour, onEdit, onDelete, onStatusChange }: TourCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-lg font-semibold">
              {tour.departure_country} → {tour.destination_country}
            </h2>
            <Badge variant={tour.type === 'public' ? 'default' : 'secondary'}>
              {tour.type === 'public' ? 'Public' : 'Privé'}
            </Badge>
          </div>
          <p className="text-gray-600 mb-1">
            Départ : {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              Capacité restante : {tour.remaining_capacity} kg
            </p>
            <p className="text-gray-600">
              Total : {tour.total_capacity} kg
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(tour)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer la tournée ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes les réservations associées seront également supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(tour.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <TourStatusTimeline 
        tourId={tour.id}
        currentStatus={tour.status}
        onStatusChange={(newStatus) => onStatusChange(tour.id, newStatus)}
      />

      <TourBookingsList 
        bookings={tour.bookings} 
        tourStatus={tour.status}
      />
    </div>
  );
}