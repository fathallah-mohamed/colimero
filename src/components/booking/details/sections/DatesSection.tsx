import React from 'react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DatesSectionProps {
  collectionDate: string | null | undefined;
  departureDate: string | null | undefined;
}

export function DatesSection({ collectionDate, departureDate }: DatesSectionProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Non définie";
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date invalide";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Date de collecte</p>
        <p className="font-medium">{formatDate(collectionDate)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Date de départ</p>
        <p className="font-medium">{formatDate(departureDate)}</p>
      </div>
    </div>
  );
}