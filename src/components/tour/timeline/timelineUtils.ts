import { TourStatus } from "@/types/tour";

export const getStatusLabel = (status: TourStatus) => {
  return status; // Les statuts sont déjà en français dans la base de données
};

export const getStatusColor = (status: TourStatus) => {
  switch (status) {
    case "Programmé":
      return "bg-blue-100 text-blue-800";
    case "Ramassage en cours":
      return "bg-yellow-100 text-yellow-800";
    case "En transit":
      return "bg-purple-100 text-purple-800";
    case "Transport terminé":
      return "bg-cyan-100 text-cyan-800";
    case "Ramassage terminé":
      return "bg-teal-100 text-teal-800";
    case "Préparation terminée":
      return "bg-emerald-100 text-emerald-800";
    case "Livraison en cours":
      return "bg-indigo-100 text-indigo-800";
    case "Livraison terminée":
      return "bg-green-100 text-green-800";
    case "Annulé":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};