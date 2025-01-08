import React from "react";
import { format, parseISO } from "date-fns";
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
      if (!dateString) {
        return "Date non définie";
      }

      const date = parseISO(dateString);
      if (isNaN(date.getTime())) {
        return "Date non définie";
      }

      return format(date, "EEEE d MMMM", { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date non définie";
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 text-sm text-gray-500 px-4 py-2">
        <span>Ville</span>
        <span>Adresse</span>
        <span>Date</span>
        <span>Heure</span>
      </div>
      {points.map((point, index) => (
        <div
          key={index}
          onClick={() => isSelectionEnabled && point.type === 'pickup' && onPointSelect(point.name)}
          className={`grid grid-cols-4 items-center p-4 text-sm ${
            point.type === 'pickup' ? 'cursor-pointer' : 'cursor-default'
          } ${
            selectedPoint === point.name
              ? "bg-[#F3F0FF] border-[#8B5CF6]"
              : "hover:bg-gray-50"
          }`}
        >
          <span className="font-medium">{point.name}</span>
          <span className="text-gray-600">{point.location}</span>
          <span className="text-gray-600">
            {formatDate(point.collection_date)}
          </span>
          <span className="text-gray-600">{point.time}</span>
        </div>
      ))}
    </div>
  );
}