import * as z from "zod";

export const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  first_name: z.string().min(2, "Le prénom est requis"),
  last_name: z.string().min(2, "Le nom est requis"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  phone_secondary: z.string().optional(),
  company_name: z.string().min(2, "Le nom de l'entreprise est requis"),
  siret: z.string().length(14, "SIRET invalide"),
  address: z.string().min(10, "L'adresse est requise"),
  coverage_area: z.array(z.string()).min(1, "Sélectionnez au moins une zone"),
  total_capacity: z.number().min(1, "La capacité doit être supérieure à 0"),
  price_per_kg: z.number().min(0.1, "Le prix doit être supérieur à 0"),
  services: z.array(z.string()).optional(),
  avatar_url: z.string().nullable(),
  terms_accepted: z.boolean(),
  customs_terms_accepted: z.boolean(),
  responsibility_terms_accepted: z.boolean(),
});

export type FormValues = z.infer<typeof formSchema>;