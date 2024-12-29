import * as z from "zod";

export const tourFormSchema = z.object({
  total_capacity: z.string()
    .min(1, "La capacité totale est requise")
    .transform(val => Number(val))
    .refine(val => val > 0, "La capacité doit être supérieure à 0"),
  remaining_capacity: z.string()
    .min(1, "La capacité restante est requise")
    .transform(val => Number(val))
    .refine(val => val >= 0, "La capacité restante doit être positive ou nulle"),
  type: z.enum(["public", "private"], {
    required_error: "Le type de tournée est requis",
  }),
  departure_date: z.string()
    .min(1, "La date de départ est requise")
    .refine(val => !isNaN(new Date(val).getTime()), "Format de date invalide"),
  collection_date: z.string()
    .min(1, "La date de collecte est requise")
    .refine(val => !isNaN(new Date(val).getTime()), "Format de date invalide"),
  route: z.array(z.object({
    name: z.string().min(1, "Le nom de la ville est requis"),
    location: z.string().min(1, "L'adresse est requise"),
    time: z.string().min(1, "L'heure est requise"),
    type: z.literal("pickup")
  })).min(1, "Au moins un point de collecte est requis"),
  departure_country: z.string().min(1, "Le pays de départ est requis"),
  destination_country: z.string().min(1, "Le pays de destination est requis"),
  terms_accepted: z.boolean(),
  customs_declaration: z.boolean()
});

export type TourFormData = z.infer<typeof tourFormSchema>;