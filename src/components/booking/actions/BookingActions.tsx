import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types/booking";
import { Edit2, XCircle, RotateCcw, CheckSquare } from "lucide-react";
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

interface BookingActionsProps {
  status: BookingStatus;
  isCollecting: boolean;
  onStatusChange: (status: BookingStatus) => void;
  onEdit: () => void;
  tourStatus?: string;
}

export function BookingActions({ status, isCollecting, onStatusChange, onEdit, tourStatus }: BookingActionsProps) {
  if (!isCollecting) return null;

  const handleStatusChange = (newStatus: BookingStatus) => {
    console.log("BookingActions - Changing status to:", newStatus);
    onStatusChange(newStatus);
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#8B5CF6] hover:text-[#7C3AED] border-[#8B5CF6] hover:border-[#7C3AED] transition-colors"
      >
        <Edit2 className="h-4 w-4" />
        Modifier
      </Button>

      {status === "cancelled" && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          onClick={() => handleStatusChange("pending")}
        >
          <RotateCcw className="h-4 w-4" />
          Remettre en attente
        </Button>
      )}

      {status === "pending" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50 transition-colors"
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
                onClick={() => handleStatusChange("cancelled")}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Confirmer l'annulation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}