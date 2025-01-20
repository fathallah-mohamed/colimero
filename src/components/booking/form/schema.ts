import { z } from "zod";

export const formSchema = z.object({
  sender_name: z.string().min(1, "Le nom de l'expéditeur est requis"),
  sender_phone: z.string().min(1, "Le téléphone de l'expéditeur est requis"),
  recipient_name: z.string().min(1, "Le nom du destinataire est requis"),
  recipient_phone: z.string().min(1, "Le téléphone du destinataire est requis"),
  recipient_address: z.string().min(1, "L'adresse de livraison est requise"),
  recipient_city: z.string().min(1, "La ville de livraison est requise"),
  item_type: z.string().min(1, "Le type de colis est requis"),
  package_description: z.string().optional(),
  pickup_city: z.string().optional(),
  delivery_city: z.string().optional(),
  weight: z.number().optional(),
  special_items: z.array(z.string()).optional(),
  content_types: z.array(z.string()).optional(),
  photos: z.array(z.any()).optional(),
  itemQuantities: z.record(z.string(), z.number()).optional(),
});

export type BookingFormData = z.infer<typeof formSchema>;