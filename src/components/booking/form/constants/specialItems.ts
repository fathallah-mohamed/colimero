export const availableSpecialItems = [
  { name: "Fragile", price: 10, icon: "package" },
  { name: "Lourd", price: 15, icon: "package" },
  { name: "Périssable", price: 20, icon: "package" },
  { name: "Électronique", price: 25, icon: "smartphone" },
  { name: "Verre", price: 30, icon: "glass-water" },
  { name: "Documents importants", price: 15, icon: "file-text" }
] as const;

export type SpecialItem = typeof availableSpecialItems[number];