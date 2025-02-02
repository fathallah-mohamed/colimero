import jsPDF from "jspdf";
import type { Booking } from "@/types/booking";

export function generateDeliverySlip(booking: Booking) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Configuration des polices et tailles
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);

  // Titre centré
  doc.text("BON DE LIVRAISON", 105, 40, { align: "center" });

  // Informations principales
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  
  // Ville de livraison
  doc.text("VILLE DE LIVRAISON:", 20, 80);
  doc.setFont("helvetica", "normal");
  doc.text(booking.delivery_city.toUpperCase(), 20, 95);

  // Destinataire
  doc.setFont("helvetica", "bold");
  doc.text("DESTINATAIRE:", 20, 130);
  doc.setFont("helvetica", "normal");
  doc.text(booking.recipient_name.toUpperCase(), 20, 145);

  // Téléphone
  doc.setFont("helvetica", "bold");
  doc.text("TÉLÉPHONE:", 20, 180);
  doc.setFont("helvetica", "normal");
  doc.text(booking.recipient_phone, 20, 195);

  // Save the PDF
  doc.save(`bon-livraison-${booking.tracking_number}.pdf`);
}