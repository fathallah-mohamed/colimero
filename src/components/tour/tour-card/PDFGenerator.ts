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
      doc.save(`tournee-${tour.id}-${format(new Date(tour.departure_date), "dd-MM-yyyy")}.pdf`);
      return true;
    }

    // Table headers
    const headers = [
      "N° Suivi",
      "Expéditeur",
      "Destinataire",
      "Ville collecte",
      "Ville livraison",
      "Poids",
      "Statut"
    ];

    // Configure table
    const startY = yPos;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const tableWidth = pageWidth - 2 * margin;
    const columnWidth = tableWidth / headers.length;

    // Draw table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, startY - 5, tableWidth, 10, "F");
    doc.setFont(undefined, "bold");
    headers.forEach((header, i) => {
      doc.text(header, margin + (i * columnWidth), startY);
    });

    // Draw table content
    doc.setFont(undefined, "normal");
    let currentY = startY + 10;

    bookings.forEach((booking: any) => {
      // Add new page if needed
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      const row = [
        booking.tracking_number,
        `${booking.sender_name}\n${booking.sender_phone}`,
        `${booking.recipient_name}\n${booking.recipient_phone}`,
        booking.pickup_city,
        booking.delivery_city,
        `${booking.weight} kg`,
        booking.status
      ];

      // Draw row
      row.forEach((cell, i) => {
        const lines = doc.splitTextToSize(cell.toString(), columnWidth - 4);
        doc.text(lines, margin + (i * columnWidth), currentY);
      });

      // Calculate max height for this row
      const maxLines = Math.max(...row.map(cell => 
        doc.splitTextToSize(cell.toString(), columnWidth - 4).length
      ));
      currentY += 7 * maxLines;

      // Add details section if special items or content types exist
      if (booking.special_items?.length > 0 || booking.content_types?.length > 0) {
        currentY += 5;
        doc.setFont(undefined, "bold");
        doc.text("Détails supplémentaires:", margin, currentY);
        doc.setFont(undefined, "normal");
        currentY += 7;

        if (booking.special_items?.length > 0) {
          const specialItems = booking.special_items.map((item: any) => 
            `${item.name}${item.quantity ? ` (${item.quantity})` : ''}`
          ).join(", ");
          const lines = doc.splitTextToSize(`Objets spéciaux: ${specialItems}`, tableWidth);
          doc.text(lines, margin, currentY);
          currentY += 7 * lines.length;
        }

        if (booking.content_types?.length > 0) {
          const lines = doc.splitTextToSize(`Types de contenu: ${booking.content_types.join(", ")}`, tableWidth);
          doc.text(lines, margin, currentY);
          currentY += 7 * lines.length;
        }

        if (booking.package_description) {
          const lines = doc.splitTextToSize(`Description: ${booking.package_description}`, tableWidth);
          doc.text(lines, margin, currentY);
          currentY += 7 * lines.length;
        }

        currentY += 5;
      }
    });

    // Save the PDF
    doc.save(`tournee-${tour.id}-${format(new Date(tour.departure_date), "dd-MM-yyyy")}.pdf`);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}