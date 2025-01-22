import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Booking } from "@/types/booking";

export function generateDeliverySlip(booking: Booking) {
  const doc = new jsPDF();
  let yPos = 20;

  // Add title and tracking number
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text("BON DE LIVRAISON", 105, yPos, { align: "center" });
  yPos += 15;

  doc.setFontSize(16);
  doc.text(`N° de suivi: ${booking.tracking_number}`, 105, yPos, { align: "center" });
  yPos += 25;

  // Configuration du style du tableau
  const tableStartX = 20;
  const colWidth = 170;
  const rowHeight = 30;
  const fontSize = 12;
  const headerFontSize = 14;

  // Fonction pour dessiner une ligne de tableau
  const drawTableRow = (title: string, content: string, y: number, isHeader = false) => {
    // Dessiner le fond
    doc.setFillColor(isHeader ? 240 : 255, isHeader ? 240 : 255, isHeader ? 240 : 255);
    doc.rect(tableStartX, y, colWidth, rowHeight, 'F');
    
    // Dessiner les bordures
    doc.setDrawColor(200, 200, 200);
    doc.rect(tableStartX, y, colWidth, rowHeight);

    // Ajouter le texte
    doc.setFontSize(isHeader ? headerFontSize : fontSize);
    doc.setFont(undefined, isHeader ? 'bold' : 'normal');
    doc.text(title, tableStartX + 5, y + 10);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(isHeader ? headerFontSize : 16);
    doc.text(content, tableStartX + 5, y + 22);
  };

  // Section Expéditeur
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text("EXPÉDITEUR", tableStartX, yPos);
  yPos += 10;

  drawTableRow("Nom complet", booking.sender_name, yPos);
  yPos += rowHeight;
  drawTableRow("Téléphone", booking.sender_phone, yPos);
  yPos += rowHeight;
  drawTableRow("Ville", booking.pickup_city, yPos);
  yPos += rowHeight + 15;

  // Section Destinataire
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text("DESTINATAIRE", tableStartX, yPos);
  yPos += 10;

  drawTableRow("Nom complet", booking.recipient_name, yPos);
  yPos += rowHeight;
  drawTableRow("Téléphone", booking.recipient_phone, yPos);
  yPos += rowHeight;
  drawTableRow("Adresse complète", booking.recipient_address, yPos);
  yPos += rowHeight;
  drawTableRow("Ville", booking.delivery_city, yPos);
  yPos += rowHeight + 15;

  // Section Colis
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text("INFORMATIONS COLIS", tableStartX, yPos);
  yPos += 10;

  drawTableRow("Type de colis", booking.item_type, yPos);
  yPos += rowHeight;
  drawTableRow("Poids", `${booking.weight} kg`, yPos);
  yPos += rowHeight;

  if (booking.special_items && booking.special_items.length > 0) {
    const specialItems = booking.special_items.map((item: any) => 
      `${item.name}${item.quantity ? ` (${item.quantity})` : ''}`
    ).join(", ");
    drawTableRow("Objets spéciaux", specialItems, yPos);
    yPos += rowHeight;
  }

  if (booking.content_types && booking.content_types.length > 0) {
    drawTableRow("Types de contenu", booking.content_types.join(", "), yPos);
    yPos += rowHeight;
  }

  if (booking.package_description) {
    drawTableRow("Description", booking.package_description, yPos);
    yPos += rowHeight;
  }

  // Add date at the bottom
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(
    `Généré le ${format(new Date(), "d MMMM yyyy à HH:mm", { locale: fr })}`,
    20,
    doc.internal.pageSize.height - 20
  );

  // Save the PDF
  doc.save(`bon-livraison-${booking.tracking_number}.pdf`);
}