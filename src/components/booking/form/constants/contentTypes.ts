export const availableContentTypes = [
  "Documents",
  "Vêtements",
  "Électronique", 
  "Nourriture",
  "Médicaments",
  "Cosmétiques",
  "Accessoires",
  "Livres",
  "Autres"
] as const;

export type ContentType = typeof availableContentTypes[number];