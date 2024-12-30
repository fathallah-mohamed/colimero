import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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
  avatar: z.instanceof(File)
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      "La taille maximale est de 5MB"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Format accepté : .jpg, .jpeg, .png et .webp"
    )
    .nullable()
    .optional(),
});

export type FormValues = z.infer<typeof formSchema>;