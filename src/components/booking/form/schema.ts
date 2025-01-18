import { z } from "zod";

export const formSchema = z.object({
  weight: z.number().min(5).max(30),
  recipient_name: z.string().min(2, "Le nom du destinataire est requis"),
  recipient_address: z.string().min(5, "L'adresse de livraison est requise"),
  recipient_phone: z.string().min(8, "Le numéro de téléphone est requis"),
  sender_name: z.string().min(2, "Votre nom est requis"),
  sender_phone: z.string().min(8, "Votre numéro de téléphone est requis"),
  item_type: z.string().min(2, "Le type de colis est requis"),
  special_items: z.string().optional(),
});

export type BookingFormData = z.infer<typeof formSchema>;