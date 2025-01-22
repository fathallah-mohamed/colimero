import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Booking } from "@/types/booking";

export function generateDeliverySlip(booking: Booking) {
  const doc = new jsPDF();
  let yPos = 20;

  // Add title
  doc.setFontSize(20);
  doc.text("Bon de livraison", 105, yPos, { align: "center" });
  yPos += 20;

  // Add tracking number
  doc.setFontSize(16);
  doc.text(`N° de suivi: ${booking.tracking_number}`, 20, yPos);
  yPos += 20;

  // Add sender information
  doc.setFontSize(14);
  doc.text("Expéditeur", 20, yPos);
  yPos += 10;
  doc.setFontSize(12);
  doc.text([
    `Nom: ${booking.sender_name}`,
    `Téléphone: ${booking.sender_phone}`,
    `Ville: ${booking.pickup_city}`
  ], 30, yPos);
  yPos += 25;

  // Add recipient information
  doc.setFontSize(14);
  doc.text("Destinataire", 20, yPos);
  yPos += 10;
  doc.setFontSize(12);
  doc.text([
    `Nom: ${booking.recipient_name}`,
    `Téléphone: ${booking.recipient_phone}`,
    `Adresse: ${booking.recipient_address}`,
    `Ville: ${booking.delivery_city}`
  ], 30, yPos);
  yPos += 35;

  // Add package information
  doc.setFontSize(14);
  doc.text("Informations du colis", 20, yPos);
  yPos += 10;
  doc.setFontSize(12);
  doc.text([
    `Type: ${booking.item_type}`,
    `Poids: ${booking.weight} kg`,
    `Description: ${booking.package_description || "Aucune description"}`
  ], 30, yPos);
  yPos += 25;

  // Add special items if any
  if (booking.special_items && booking.special_items.length > 0) {
    doc.setFontSize(14);
    doc.text("Objets spéciaux", 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    const specialItems = booking.special_items.map((item: any) => 
      `${item.name}${item.quantity ? ` (${item.quantity})` : ''}`
    );
    doc.text(specialItems, 30, yPos);
    yPos += 15;
  }

  // Add content types if any
  if (booking.content_types && booking.content_types.length > 0) {
    doc.setFontSize(14);
    doc.text("Types de contenu", 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(booking.content_types.join(", "), 30, yPos);
  }

  // Add date
  doc.setFontSize(10);
  doc.text(
    `Généré le ${format(new Date(), "d MMMM yyyy à HH:mm", { locale: fr })}`,
    20,
    doc.internal.pageSize.height - 20
  );

  // Save the PDF
  doc.save(`bon-livraison-${booking.tracking_number}.pdf`);
}