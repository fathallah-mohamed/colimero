import { TourStatus } from "@/types/tour";

export const getStatusLabel = (status: TourStatus) => {
  return status;
};

export const getStatusColor = (status: TourStatus) => {
  switch (status) {
    case "Programmée":
      return "bg-blue-100 text-blue-800";
    case "Ramassage en cours":
      return "bg-yellow-100 text-yellow-800";
    case "En transit":
      return "bg-purple-100 text-purple-800";
    case "Livraison en cours":
      return "bg-indigo-100 text-indigo-800";
    case "Terminée":
      return "bg-green-100 text-green-800";
    case "Annulée":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};