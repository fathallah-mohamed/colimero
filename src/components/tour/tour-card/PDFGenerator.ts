import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

export async function generateTourPDF(tour: any) {
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
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}