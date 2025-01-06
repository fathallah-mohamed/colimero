import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CollectionPoint {
  name: string;
  location: string;
  time: string;
  collection_date: string;
}

interface CollectionPointsListProps {
  points: CollectionPoint[];
}

export function CollectionPointsList({ points }: CollectionPointsListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Points de collecte</h3>
      <div className="space-y-3">
        {points.map((point, index) => (
          <div
            key={index}
            className="flex flex-col p-4 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <span className="font-medium">{point.name}</span>
            <span className="text-gray-600">{point.location}</span>
            <span className="text-gray-600">
              {format(new Date(point.collection_date), "EEEE d MMMM", { locale: fr })}
            </span>
            <span className="text-gray-600">{point.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}