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
  user?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
}

export function RequestHeader({ tour, user }: RequestHeaderProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold">
        {tour?.departure_country} → {tour?.destination_country}
      </h2>
      <p className="text-gray-600">
        Transporteur : {tour?.carriers?.company_name}
      </p>
      {user && (
        <>
          <p className="text-gray-600">
            Client : {user.first_name} {user.last_name}
          </p>
          {user.phone && (
            <p className="text-gray-600">
              Téléphone : {user.phone}
            </p>
          )}
        </>
      )}
      <p className="text-gray-600">
        Date de départ : {tour?.departure_date ? 
          format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr }) : 
          'Non spécifiée'}
      </p>
    </div>
  );
}