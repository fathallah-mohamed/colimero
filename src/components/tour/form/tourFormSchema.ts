import * as z from "zod";

export const tourFormSchema = z.object({
  departure_country: z.string().min(1, "Le pays de départ est requis"),
  destination_country: z.string().min(1, "Le pays de destination est requis"),
  total_capacity: z.number().min(1, "La capacité totale doit être supérieure à 0"),
  remaining_capacity: z.number().min(0, "La capacité restante ne peut pas être négative"),
  type: z.enum(["public", "private"]),
  departure_date: z.date({
    required_error: "La date de départ est requise",
  }),
  route: z.array(
    z.object({
      name: z.string().min(1, "La ville est requise"),
      location: z.string().min(1, "L'adresse est requise"),
      collection_date: z.string().min(1, "La date de collecte est requise"),
      time: z.string().min(1, "L'heure est requise"),
      type: z.literal("pickup")
    })
  ).min(1, "Au moins un point de collecte est requis"),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions",
  }),
  customs_declaration: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter la déclaration douanière",
  }),
  info_accuracy: z.boolean().refine((val) => val === true, {
    message: "Vous devez certifier l'exactitude des informations",
  }),
  transport_responsibility: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter la responsabilité du transport",
  }),
  platform_rules: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les CGU",
  }),
  safety_confirmation: z.boolean().refine((val) => val === true, {
    message: "Vous devez confirmer la sécurité des colis",
  }),
});

export type TourFormValues = z.infer<typeof tourFormSchema>;