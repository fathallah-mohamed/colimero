import { z } from "zod";

export const formSchema = z.object({
  sender_name: z.string().min(1, "Le nom de l'expéditeur est requis"),
  sender_phone: z.string().min(1, "Le téléphone de l'expéditeur est requis"),
  recipient_name: z.string().min(1, "Le nom du destinataire est requis"),
  recipient_phone: z.string().min(1, "Le téléphone du destinataire est requis"),
  recipient_address: z.string().min(1, "L'adresse de livraison est requise"),
  delivery_city: z.string().min(1, "La ville de livraison est requise"),
  pickup_city: z.string().min(1, "La ville de ramassage est requise"),
  item_type: z.string().min(1, "Le type de colis est requis"),
  weight: z.number().min(5).max(30),
  special_items: z.array(z.object({
    name: z.string(),
    quantity: z.number().min(1)
  })).default([]),
  content_types: z.array(z.string()).default([]),
  photos: z.array(z.any()).default([]),
  package_description: z.string().optional()
});

export type BookingFormData = z.infer<typeof formSchema>;