import * as z from "zod";

export const formSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  company_name: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  siret: z.string().length(14, "Le numéro SIRET doit contenir 14 chiffres"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  phone_secondary: z.string().optional(),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  coverage_area: z.array(z.string()).min(1, "Sélectionnez au moins un pays"),
  total_capacity: z.number().min(1, "La capacité totale doit être supérieure à 0"),
  price_per_kg: z.number().min(0, "Le prix par kg doit être positif"),
  services: z.array(z.string()).min(1, "Sélectionnez au moins un service"),
});

export type FormValues = z.infer<typeof formSchema>;