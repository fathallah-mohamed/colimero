import * as z from "zod";

export const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  first_name: z.string().min(2, "Le prénom est requis"),
  last_name: z.string().min(2, "Le nom est requis"),
  company_name: z.string().min(2, "Le nom de l'entreprise est requis"),
  siret: z.string().min(14, "SIRET invalide").max(14, "SIRET invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  phone_secondary: z.string().optional(),
  address: z.string().min(5, "L'adresse est requise"),
  coverage_area: z.array(z.string()).min(1, "Sélectionnez au moins une zone"),
  total_capacity: z.number().min(1, "La capacité doit être supérieure à 0"),
  price_per_kg: z.number().min(1, "Le prix par kg doit être supérieur à 0"),
  services: z.array(z.string()).min(1, "Sélectionnez au moins un service"),
  avatar_url: z.string().nullable(),
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
// For backward compatibility
export const carrierSignupSchema = formSchema;
export type CarrierSignupFormValues = FormValues;