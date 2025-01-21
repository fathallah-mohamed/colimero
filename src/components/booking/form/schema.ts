import * as z from "zod";

export const senderSchema = z.object({
  sender_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  sender_phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
});

export const recipientSchema = z.object({
  recipient_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  recipient_phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  recipient_email: z.string().email("L'email n'est pas valide").optional(),
  recipient_address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  delivery_city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
});

export const packageSchema = z.object({
  pickup_city: z.string(),
  item_type: z.string().min(2, "Le type d'objet doit contenir au moins 2 caractères"),
  weight: z.number().min(5, "Le poids minimum est de 5kg").max(30, "Le poids maximum est de 30kg"),
  special_items: z.array(z.object({
    name: z.string(),
    quantity: z.number().min(1),
    price: z.number().optional()
  })),
  content_types: z.array(z.string()),
  photos: z.array(z.union([z.string(), z.instanceof(File)])),
  package_description: z.string().optional(),
});

export const termsSchema = z.object({
  terms_accepted: z.boolean(),
  customs_declaration: z.boolean(),
});

export const formSchema = senderSchema
  .merge(recipientSchema)
  .merge(packageSchema)
  .merge(termsSchema);

export type BookingFormData = z.infer<typeof formSchema>;
export type SenderFormData = z.infer<typeof senderSchema>;
export type RecipientFormData = z.infer<typeof recipientSchema>;
export type PackageFormData = z.infer<typeof packageSchema>;
export type TermsFormData = z.infer<typeof termsSchema>;