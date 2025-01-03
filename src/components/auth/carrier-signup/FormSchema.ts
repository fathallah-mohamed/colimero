import * as z from "zod";

export const carrierSignupSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  first_name: z.string().min(2, "Le prénom est requis"),
  last_name: z.string().min(2, "Le nom est requis"),
  company_name: z.string().min(2, "Le nom de l'entreprise est requis"),
  siret: z.string().min(14, "SIRET invalide").max(14, "SIRET invalide"),
  address: z.string().min(5, "L'adresse est requise"),
  phone_secondary: z.string().optional(),
  coverage_area: z.array(z.string()).min(1, "Sélectionnez au moins une zone"),
  services: z.array(z.string()).min(1, "Sélectionnez au moins un service"),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions générales",
  }),
  customs_declaration: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter la déclaration douanière",
  }),
  responsibility_terms_accepted: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions de responsabilité",
  }),
});

export type CarrierSignupFormValues = z.infer<typeof carrierSignupSchema>;