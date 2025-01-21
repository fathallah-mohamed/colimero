import * as z from "zod";

export const formSchema = z.object({
  sender_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  sender_phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  recipient_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  recipient_phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  recipient_address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  delivery_city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  pickup_city: z.string(),
  item_type: z.string(),
  weight: z.number().min(5).max(30),
  special_items: z.array(z.object({
    name: z.string(),
    quantity: z.number().min(1)
  })),
  content_types: z.array(z.string()),
  photos: z.array(z.union([z.string(), z.instanceof(File)])),
  package_description: z.string().optional(),
  terms_accepted: z.boolean(),
  customs_declaration: z.boolean()
});

export type BookingFormData = z.infer<typeof formSchema>;