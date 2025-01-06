import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CollectionPointProps {
  selectedStop: {
    name: string;
    location: string;
    time: string;
    collection_date: string;
  };
}

export function CollectionPoint({ selectedStop }: CollectionPointProps) {
  return (
    <div className="space-y-2">
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-600">
          Ville : {selectedStop.name}
        </p>
        <p className="text-sm text-gray-600">
          Emplacement : {selectedStop.location}
        </p>
        <p className="text-sm text-gray-600">
          Date de collecte : {format(new Date(selectedStop.collection_date), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
        <p className="text-sm text-gray-600">
          Heure : {selectedStop.time}
        </p>
      </div>
    </div>
  );
}