import { BookingStatus } from "@/types/booking";
import { XSquare, Edit, RotateCcw, Package } from "lucide-react";
import { BookingActionButton } from "./BookingActionButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  // Si c'est un client
  if (userType === 'client') {
    // Ne montrer les actions que si la réservation est en attente
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-2">
          <BookingActionButton
            onClick={handleEdit}
            icon={Edit}
            label="Modifier"
          />
          <BookingActionButton
            onClick={() => handleStatusChange("cancelled")}
            icon={XSquare}
            label="Annuler"
            colorClass="text-red-500 hover:text-red-600"
          />
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
        <BookingActionButton
          onClick={handleEdit}
          icon={Edit}
          label="Modifier"
        />

        {status === "cancelled" && (
          <BookingActionButton
            onClick={() => handleStatusChange("pending")}
            icon={RotateCcw}
            label="Remettre en attente"
            colorClass="text-blue-500 hover:text-blue-600"
          />
        )}

        {status === "pending" && (
          <>
            <BookingActionButton
              onClick={() => handleStatusChange("collected")}
              icon={Package}
              label="Marquer comme collecté"
              colorClass="text-green-500 hover:text-green-600"
            />
            <BookingActionButton
              onClick={() => handleStatusChange("cancelled")}
              icon={XSquare}
              label="Annuler"
              colorClass="text-red-500 hover:text-red-600"
            />
          </>
        )}
      </div>
    );
  }

  return null;
}