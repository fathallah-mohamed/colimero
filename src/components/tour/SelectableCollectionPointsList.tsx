import React from "react";
import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import type { RouteStop } from "@/types/tour";

interface SelectableCollectionPointsListProps {
  points: RouteStop[];
  selectedPoint: string;
  onPointSelect: (cityName: string) => void;
  isSelectionEnabled: boolean;
  tourDepartureDate: string;
}

export function SelectableCollectionPointsList({
  points,
  selectedPoint,
  onPointSelect,
  isSelectionEnabled,
  tourDepartureDate
}: SelectableCollectionPointsListProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        console.error("Invalid date:", dateString);
        return "Date invalide";
      }
      return format(date, "EEEE d MMMM", { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date invalide";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 text-sm text-gray-500 px-4">
        <span className="font-medium">Ville</span>
        <span className="font-medium">Adresse</span>
        <span className="font-medium">Date</span>
        <span className="font-medium">Heure</span>
      </div>
      {points.map((point, index) => (
        <div
          key={index}
          onClick={() => isSelectionEnabled && onPointSelect(point.name)}
          className={`p-4 rounded-lg ${
            isSelectionEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
          } border transition-colors ${
            selectedPoint === point.name
              ? "border-primary bg-primary/5"
              : isSelectionEnabled
                ? "border-gray-200 hover:border-primary/20"
                : "border-gray-200"
          }`}
        >
          <div className="grid grid-cols-4 items-center text-sm gap-4">
            <span className="font-medium">{point.name}</span>
            <span className="text-gray-600">{point.location}</span>
            <span className="text-gray-600">
              {formatDate(point.collection_date)}
            </span>
            <span className="text-gray-600">{point.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}