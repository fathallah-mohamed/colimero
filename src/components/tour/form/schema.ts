import * as z from "zod";

export const tourFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string(),
  capacity: z.number().min(0),
  price: z.number().min(0),
});

export type TourFormValues = z.infer<typeof tourFormSchema>;