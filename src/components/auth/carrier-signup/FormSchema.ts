import * as z from "zod";

export const formSchema = z.object({
  email: z.string().email("Email invalide"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  companyName: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  siret: z.string().length(14, "Le numéro SIRET doit contenir 14 chiffres"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  phoneSecondary: z.string().optional(),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  totalCapacity: z.number().min(1, "La capacité totale doit être supérieure à 0"),
  pricePerKg: z.number().min(0, "Le prix par kg doit être positif"),
  coverageArea: z.array(z.string()).min(1, "Sélectionnez au moins un pays"),
  services: z.array(z.string()).min(1, "Sélectionnez au moins un service"),
  avatar_url: z.string().nullable().optional(),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions générales",
  }),
  customs_terms_accepted: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions douanières",
  }),
  responsibility_terms_accepted: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions de responsabilité",
  }),
});

export type FormValues = z.infer<typeof formSchema>;