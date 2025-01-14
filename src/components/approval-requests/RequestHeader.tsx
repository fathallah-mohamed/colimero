import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RequestHeaderProps {
  tour: {
    departure_country: string;
    destination_country: string;
    carriers?: {
      company_name: string;
    };
    departure_date?: string;
  };
}

export function RequestHeader({ tour }: RequestHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-medium">{tour?.departure_country}</span>
        <span>→</span>
        <span className="font-medium">{tour?.destination_country}</span>
      </div>
      <p className="text-gray-600">
        Transporteur : {tour?.carriers?.company_name}
      </p>
      <p className="text-gray-600">
        Date de départ : {tour?.departure_date ? 
          format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr }) : 
          'Non spécifiée'}
      </p>
    </div>
  );
}