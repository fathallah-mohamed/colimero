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
        .eq("tour_id", tour.id)
        .order('delivery_city');

      if (error) throw error;

      // Create PDF document
      const doc = new jsPDF();
      let yPos = 20;

      // Add title and tour details
      doc.setFontSize(16);
      doc.text(`Tournée ${tour.departure_country} → ${tour.destination_country}`, 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`Date de départ: ${format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}`, 20, yPos);
      yPos += 7;
      doc.text(`Capacité totale: ${tour.total_capacity}kg`, 20, yPos);
      yPos += 7;
      doc.text(`Capacité restante: ${tour.remaining_capacity}kg`, 20, yPos);
      yPos += 15;

      if (!bookings || bookings.length === 0) {
        doc.text("Aucune réservation pour cette tournée.", 20, yPos);
      } else {
        // Group bookings by delivery city
        const bookingsByCity = bookings.reduce((acc: { [key: string]: any[] }, booking) => {
          if (!acc[booking.delivery_city]) {
            acc[booking.delivery_city] = [];
          }
          acc[booking.delivery_city].push(booking);
          return acc;
        }, {});

        // For each city
        Object.entries(bookingsByCity).forEach(([city, cityBookings]) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }

          // Add city header
          doc.setFontSize(14);
          doc.setFont(undefined, 'bold');
          doc.text(`Ville de livraison: ${city}`, 20, yPos);
          yPos += 10;

          // Add table headers
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          const headers = ['N° Suivi', 'Destinataire', 'Adresse', 'Téléphone', 'Poids', 'Statut'];
          const colWidths = [30, 35, 45, 30, 20, 25];
          let xPos = 15;

          headers.forEach((header, i) => {
            doc.text(header, xPos, yPos);
            xPos += colWidths[i];
          });
          yPos += 7;

          // Add a line under headers
          doc.line(15, yPos - 3, 195, yPos - 3);
          
          // Add bookings for this city
          cityBookings.forEach((booking) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
              
              // Repeat headers on new page
              xPos = 15;
              headers.forEach((header, i) => {
                doc.text(header, xPos, yPos);
                xPos += colWidths[i];
              });
              yPos += 7;
              doc.line(15, yPos - 3, 195, yPos - 3);
            }

            xPos = 15;
            doc.text(booking.tracking_number, xPos, yPos);
            xPos += colWidths[0];
            
            doc.text(booking.recipient_name, xPos, yPos);
            xPos += colWidths[1];
            
            // Split long addresses into multiple lines if needed
            const addressLines = doc.splitTextToSize(booking.recipient_address, 40);
            doc.text(addressLines, xPos, yPos);
            xPos += colWidths[2];
            
            doc.text(booking.recipient_phone, xPos, yPos);
            xPos += colWidths[3];
            
            doc.text(`${booking.weight}kg`, xPos, yPos);
            xPos += colWidths[4];
            
            doc.text(booking.status, xPos, yPos);
            
            yPos += addressLines.length > 1 ? 7 * addressLines.length : 7;
          });

          yPos += 10; // Add space between cities
        });
      }

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
