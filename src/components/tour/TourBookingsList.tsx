import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const statusMap = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmée", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" },
};

export function TourBookingsList({ bookings }: { bookings: any[] }) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const handleCancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
      });
      return;
    }

    toast({
      title: "Réservation annulée",
      description: "La réservation a été annulée avec succès",
    });
  };

  const filteredBookings = statusFilter === "all" 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-sm text-gray-500 mt-4">
        Aucune réservation pour cette tournée
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Réservations</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Package className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{booking.recipient_name}</p>
                  <p className="text-sm text-gray-500">{booking.recipient_phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusMap[booking.status as keyof typeof statusMap].color}>
                  {statusMap[booking.status as keyof typeof statusMap].label}
                </Badge>
                {booking.status !== 'cancelled' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Annuler la réservation ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Êtes-vous sûr de vouloir annuler cette réservation ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Confirmer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Ville de collecte</p>
                <p className="font-medium">{booking.pickup_city}</p>
              </div>
              <div>
                <p className="text-gray-500">Ville de livraison</p>
                <p className="font-medium">{booking.delivery_city}</p>
              </div>
              <div>
                <p className="text-gray-500">Poids</p>
                <p className="font-medium">{booking.weight} kg</p>
              </div>
              <div>
                <p className="text-gray-500">Numéro de suivi</p>
                <p className="font-medium">{booking.tracking_number}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}