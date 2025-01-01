import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Edit2, Trash2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TourStatusTimeline } from "./TourStatusTimeline";
import { TourBookingsList } from "./TourBookingsList";
import jsPDF from "jspdf";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TourCardProps {
  tour: any;
  onEdit: (tour: any) => void;
  onDelete: (tourId: number) => void;
  onStatusChange: (tourId: number, newStatus: string) => void;
}

export function TourCard({ tour, onEdit, onDelete, onStatusChange }: TourCardProps) {
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    try {
      // Fetch bookings for this tour
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("tour_id", tour.id);

      if (error) throw error;

      // Create PDF document
      const doc = new jsPDF();
      let yPos = 20;

      // Add title
      doc.setFontSize(16);
      doc.text(`Tournée ${tour.departure_country} → ${tour.destination_country}`, 20, yPos);
      yPos += 10;

      // Add tour details
      doc.setFontSize(12);
      doc.text(`Date de départ: ${format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}`, 20, yPos);
      yPos += 10;
      doc.text(`Capacité totale: ${tour.total_capacity}kg`, 20, yPos);
      yPos += 10;
      doc.text(`Capacité restante: ${tour.remaining_capacity}kg`, 20, yPos);
      yPos += 20;

      // Add bookings
      doc.setFontSize(14);
      doc.text("Réservations:", 20, yPos);
      yPos += 10;

      bookings?.forEach((booking, index) => {
        if (yPos > 270) { // Check if we need a new page
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.text(`Réservation ${index + 1}:`, 20, yPos);
        yPos += 7;
        
        doc.setFontSize(10);
        doc.text(`Expéditeur: ${booking.sender_name} - ${booking.sender_phone}`, 30, yPos);
        yPos += 7;
        doc.text(`Destinataire: ${booking.recipient_name} - ${booking.recipient_phone}`, 30, yPos);
        yPos += 7;
        doc.text(`Adresse: ${booking.recipient_address}`, 30, yPos);
        yPos += 7;
        doc.text(`Ville de collecte: ${booking.pickup_city}`, 30, yPos);
        yPos += 7;
        doc.text(`Poids: ${booking.weight}kg`, 30, yPos);
        yPos += 7;
        doc.text(`Statut: ${booking.status}`, 30, yPos);
        yPos += 7;
        doc.text(`N° de suivi: ${booking.tracking_number}`, 30, yPos);
        yPos += 15;
      });

      // Save the PDF
      doc.save(`tournee-${tour.id}-${format(new Date(tour.departure_date), "dd-MM-yyyy")}.pdf`);

      toast({
        title: "Succès",
        description: "Le PDF a été généré avec succès",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF",
      });
    }
  };

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
            onClick={handleDownloadPDF}
            title="Télécharger la liste des réservations"
          >
            <FileDown className="h-4 w-4" />
          </Button>
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
        tourId={tour.id}
        tourStatus={tour.status}
      />
    </div>
  );
}