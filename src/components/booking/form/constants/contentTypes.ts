export const availableContentTypes = [
  "Documents",
  "Vêtements",
  "Électronique", 
  "Nourriture",
  "Médicaments"
] as const;

export type ContentType = typeof availableContentTypes[number];