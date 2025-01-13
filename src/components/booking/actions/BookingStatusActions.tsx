import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types/booking";
import { Edit2, XCircle } from "lucide-react";
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

interface BookingStatusActionsProps {
  bookingId: string;
  bookingStatus: BookingStatus;
  tourStatus: string;
  isCarrier: boolean;
  onStatusChange: () => Promise<void>;
  onEdit: () => void;
}

export function BookingStatusActions({
  bookingId,
  bookingStatus,
  tourStatus,
  isCarrier,
  onStatusChange,
  onEdit,
}: BookingStatusActionsProps) {
  if (bookingStatus === "cancelled" || tourStatus !== "Programmée") {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#8B5CF6] hover:text-[#7C3AED] border-[#8B5CF6] hover:border-[#7C3AED]"
      >
        <Edit2 className="h-4 w-4" />
        Modifier
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4" />
            Annuler
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200">Retour</AlertDialogCancel>
            <AlertDialogAction
              onClick={onStatusChange}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}