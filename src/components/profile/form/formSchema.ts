import * as z from "zod";

export const formSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  phone_secondary: z.string().optional(),
  address: z.string().optional()
});

export type FormValues = z.infer<typeof formSchema>;