import { BookingStatus } from "@/types/booking";
import { XSquare, Edit, RotateCcw, Package } from "lucide-react";
import { BookingActionButton } from "./BookingActionButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Button } from "@/components/ui/button";

interface BookingActionsProps {
  status: BookingStatus;
  isCollecting: boolean;
  onStatusChange: (status: BookingStatus) => void;
  onEdit: () => void;
  tourStatus?: string;
}

export function BookingActions({ 
  status, 
  isCollecting, 
  onStatusChange, 
  onEdit,
  tourStatus
}: BookingActionsProps) {
  const [userType, setUserType] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    const checkUserType = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserType(user.user_metadata?.user_type);
      }
    };
    checkUserType();
  }, []);

  const handleStatusChange = (newStatus: BookingStatus) => {
    console.log("BookingActions - Changing status to:", newStatus);
    onStatusChange(newStatus);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit button clicked");
    onEdit();
  };

  const handleCancel = () => {
    handleStatusChange("cancelled");
    setShowCancelDialog(false);
  };

  // Si c'est un client
  if (userType === 'client') {
    // Ne montrer les actions que si la réservation est en attente
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white hover:bg-gray-100"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Button>

          <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <XSquare className="h-4 w-4" />
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
                <AlertDialogCancel>Retour</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
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
    // Si la réservation est annulée ou dans un autre état, ne pas montrer d'actions
    return null;
  }

  // Pour les transporteurs, afficher toutes les actions possibles
  if (isCollecting || tourStatus === 'planned') {
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={handleEdit}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white hover:bg-gray-100"
        >
          <Edit className="h-4 w-4" />
          Modifier
        </Button>

        {status === "cancelled" && (
          <Button
            onClick={() => handleStatusChange("pending")}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <RotateCcw className="h-4 w-4" />
            Remettre en attente
          </Button>
        )}

        {status === "pending" && (
          <>
            <Button
              onClick={() => handleStatusChange("collected")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <Package className="h-4 w-4" />
              Marquer comme collecté
            </Button>

            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <XSquare className="h-4 w-4" />
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
                  <AlertDialogCancel>Retour</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Confirmer l'annulation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    );
  }

  return null;
}