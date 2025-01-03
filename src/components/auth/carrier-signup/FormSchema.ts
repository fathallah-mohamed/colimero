import * as z from "zod";

export const carrierSignupSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  company_name: z.string().min(1, "Le nom de l'entreprise est requis"),
  siret: z.string().min(14, "Le numéro SIRET doit contenir 14 chiffres").max(14),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  phone_secondary: z.string().optional(),
  address: z.string().min(1, "L'adresse est requise"),
  coverage_area: z.array(z.string()).min(1, "Au moins une zone de couverture est requise"),
  total_capacity: z.number().min(0, "La capacité totale doit être positive"),
  price_per_kg: z.number().min(0, "Le prix par kg doit être positif"),
  services: z.array(z.string()).min(1, "Au moins un service est requis"),
  avatar_url: z.string().nullable(),
  terms_accepted: z.boolean(),
  customs_declaration: z.boolean(),
  responsibility_terms_accepted: z.boolean(),
});

// Export the type
export type CarrierSignupFormValues = z.infer<typeof carrierSignupSchema>;

// Export the schema with the name that's being imported
export const formSchema = carrierSignupSchema;
export type FormValues = CarrierSignupFormValues;