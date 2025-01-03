import * as z from "zod";

export const tourFormSchema = z.object({
  departure_country: z.string().min(1, "Le pays de départ est requis"),
  destination_country: z.string().min(1, "Le pays de destination est requis"),
  total_capacity: z.number().min(1, "La capacité totale doit être supérieure à 0"),
  remaining_capacity: z.number().min(0, "La capacité restante doit être positive ou nulle"),
  type: z.enum(["public", "private"]),
  departure_date: z.date(),
  route: z.array(
    z.object({
      name: z.string().min(1, "La ville est requise"),
      location: z.string().min(1, "L'adresse est requise"),
      collection_date: z.string().min(1, "La date de collecte est requise"),
      time: z.string().min(1, "L'heure est requise"),
      type: z.literal("pickup")
    })
  ).min(1, "Au moins un point de collecte est requis"),
  terms_accepted: z.boolean(),
  customs_declaration: z.boolean()
});