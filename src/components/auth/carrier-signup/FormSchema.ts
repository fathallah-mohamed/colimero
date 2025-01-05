import * as z from "zod";

export const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  phone_secondary: z.string().optional(),
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  company_name: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  siret: z.string().min(14, "Le numéro SIRET doit contenir 14 chiffres"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  coverage_area: z.array(z.string())
    .length(2, "Vous devez sélectionner la France et un pays du Maghreb")
    .refine(
      (arr) => arr.includes('FR'),
      "La France doit être sélectionnée"
    )
    .refine(
      (arr) => arr.some(country => ['TN', 'MA', 'DZ'].includes(country)),
      "Vous devez sélectionner un pays du Maghreb"
    ),
  services: z.array(z.string()).min(1, "Sélectionnez au moins un service"),
  total_capacity: z.number().min(0),
  price_per_kg: z.number().min(0),
  avatar_url: z.string().nullable(),
  consents: z.record(z.string(), z.boolean()).refine(
    (consents) => Object.values(consents).every(value => value === true),
    "Vous devez accepter tous les consentements pour continuer"
  ),
});

export type FormValues = z.infer<typeof formSchema>;