export const availableSpecialItems = [
  { name: "Fragile", price: 10, icon: "package" },
  { name: "Lourd", price: 15, icon: "package" },
  { name: "Périssable", price: 20, icon: "package" }
] as const;

export type SpecialItem = typeof availableSpecialItems[number];