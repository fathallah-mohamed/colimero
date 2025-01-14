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
    yPos += 7;
    doc.text(`Statut: ${tour.status}`, 20, yPos);
    yPos += 7;
    doc.text(`Type: ${tour.type === 'public' ? 'Publique' : 'Privée'}`, 20, yPos);
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

        // Process each booking
        cityBookings.forEach((booking) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(12);
          doc.setFont(undefined, 'normal');

          // Booking header
          doc.text(`Réservation #${booking.tracking_number}`, 20, yPos);
          yPos += 7;

          // Sender info
          doc.text("Expéditeur:", 25, yPos);
          yPos += 5;
          doc.setFontSize(10);
          doc.text(`${booking.sender_name}`, 30, yPos);
          yPos += 5;
          doc.text(`Tél: ${booking.sender_phone}`, 30, yPos);
          yPos += 5;
          doc.text(`Ville: ${booking.pickup_city}`, 30, yPos);
          yPos += 8;

          // Recipient info
          doc.setFontSize(12);
          doc.text("Destinataire:", 25, yPos);
          yPos += 5;
          doc.setFontSize(10);
          doc.text(`${booking.recipient_name}`, 30, yPos);
          yPos += 5;
          doc.text(`Tél: ${booking.recipient_phone}`, 30, yPos);
          yPos += 5;
          doc.text(`Adresse: ${booking.recipient_address}`, 30, yPos);
          yPos += 8;

          // Package details
          doc.setFontSize(12);
          doc.text("Détails du colis:", 25, yPos);
          yPos += 5;
          doc.setFontSize(10);
          doc.text(`Poids: ${booking.weight}kg`, 30, yPos);
          yPos += 5;
          
          if (booking.content_types?.length > 0) {
            doc.text(`Types de contenu: ${booking.content_types.join(", ")}`, 30, yPos);
            yPos += 5;
          }

          if (booking.special_items?.length > 0) {
            const specialItems = booking.special_items.map((item: any) => 
              `${item.name}${item.quantity ? ` (${item.quantity})` : ''}`
            ).join(", ");
            doc.text(`Objets spéciaux: ${specialItems}`, 30, yPos);
            yPos += 5;
          }

          if (booking.package_description) {
            doc.text(`Description: ${booking.package_description}`, 30, yPos);
            yPos += 5;
          }

          doc.text(`Statut: ${booking.status}`, 30, yPos);
          yPos += 15;
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