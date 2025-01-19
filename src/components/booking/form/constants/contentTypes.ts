export const availableContentTypes = [
  "Documents",
  "Vêtements",
  "Électronique", 
  "Nourriture",
  "Médicaments",
  "Autres"
] as const;

export type ContentType = typeof availableContentTypes[number];