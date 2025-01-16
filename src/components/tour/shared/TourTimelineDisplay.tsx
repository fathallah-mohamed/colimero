import { TourStatus } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, XCircle, Truck, Plane, Package, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TourTimelineDisplayProps {
  status: TourStatus;
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
  tourId: number;
  userType?: string;
  canEdit?: boolean;
  variant?: 'client' | 'carrier';
  onEdit?: () => void;
}

export function TourTimelineDisplay({ 
  status, 
  onStatusChange, 
  tourId,
  userType,
  canEdit = false,
  variant = 'carrier',
  onEdit
}: TourTimelineDisplayProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPendingBookingsDialog, setShowPendingBookingsDialog] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    if (onStatusChange) {
      await onStatusChange("Annulée");
    }
    setShowCancelDialog(false);
  };

  const checkPendingBookings = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('status')
        .eq('tour_id', tourId)
        .eq('status', 'pending');

      if (error) throw error;

      if (bookings && bookings.length > 0) {
        setShowPendingBookingsDialog(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking pending bookings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vérifier les réservations en attente",
      });
      return true;
    }
  };

  const handleStartCollection = async () => {
    const hasPendingBookings = await checkPendingBookings();
    if (!hasPendingBookings && onStatusChange) {
      await onStatusChange("Ramassage en cours");
    }
  };

  const handleStartTransit = async () => {
    if (onStatusChange) {
      await onStatusChange("En transit");
    }
  };

  const handleStartDelivery = async () => {
    if (onStatusChange) {
      await onStatusChange("Livraison en cours");
    }
  };

  const handleComplete = async () => {
    if (onStatusChange) {
      await onStatusChange("Terminée");
    }
  };

  // If the tour is cancelled, show cancelled message
  if (status === "Annulée") {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
        <XCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700 font-medium">Cette tournée a été annulée</span>
      </div>
    );
  }

  const isActive = !["Terminée", "Annulée"].includes(status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        {status === "Programmée" && canEdit && (
          <Button 
            onClick={handleStartCollection}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Truck className="h-4 w-4 mr-2" />
            Démarrer le ramassage
          </Button>
        )}

        {status === "Ramassage en cours" && canEdit && (
          <Button 
            onClick={handleStartTransit}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plane className="h-4 w-4 mr-2" />
            Démarrer le transit
          </Button>
        )}

        {status === "En transit" && canEdit && (
          <Button 
            onClick={handleStartDelivery}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Package className="h-4 w-4 mr-2" />
            Démarrer la livraison
          </Button>
        )}

        {status === "Livraison en cours" && canEdit && (
          <Button 
            onClick={handleComplete}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Terminer la tournée
          </Button>
        )}
      </div>

      {isActive && canEdit && (
        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onEdit}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier la tournée
          </Button>

          <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2 hover:bg-destructive/90 transition-colors">
                <XCircle className="h-4 w-4" />
                Annuler la tournée
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Annuler la tournée ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. La tournée sera définitivement annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Confirmer l'annulation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <AlertDialog open={showPendingBookingsDialog} onOpenChange={setShowPendingBookingsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Réservations en attente
            </AlertDialogTitle>
            <AlertDialogDescription>
              Il y a des réservations en attente sur cette tournée. Vous devez confirmer ou annuler toutes les réservations en attente avant de démarrer le ramassage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowPendingBookingsDialog(false)}>
              Compris
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}