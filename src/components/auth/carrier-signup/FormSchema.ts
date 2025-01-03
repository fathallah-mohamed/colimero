import * as z from "zod";

export const formSchema = z.object({
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  first_name: z.string().min(2, "Le prénom est requis"),
  last_name: z.string().min(2, "Le nom est requis"),
  company_name: z.string().min(2, "Le nom de l'entreprise est requis"),
  siret: z.string().min(14, "SIRET invalide").max(14, "SIRET invalide"),
  address: z.string().min(10, "L'adresse est requise"),
  phone_secondary: z.string().optional(),
  total_capacity: z.number().min(1, "La capacité doit être supérieure à 0"),
  price_per_kg: z.number().min(0.1, "Le prix doit être supérieur à 0"),
  coverage_area: z.array(z.string()).min(1, "Sélectionnez au moins une zone"),
  terms_accepted: z.boolean(),
  customs_declaration: z.boolean(),
});