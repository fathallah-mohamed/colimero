import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SendPackageFiltersProps {
  selectedRoute: string;
  setSelectedRoute: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  tourType: "public" | "private";
  setTourType: (value: "public" | "private") => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export function SendPackageFilters({
  selectedRoute,
  setSelectedRoute,
  selectedStatus,
  setSelectedStatus,
  tourType,
  setTourType,
  sortBy,
  setSortBy
}: SendPackageFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Trajet
        </label>
        <Select value={selectedRoute} onValueChange={setSelectedRoute}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un trajet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FR_TO_TN">France → Tunisie</SelectItem>
            <SelectItem value="TN_TO_FR">Tunisie → France</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Statut
        </label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Programmée">Programmée</SelectItem>
            <SelectItem value="Ramassage en cours">Ramassage en cours</SelectItem>
            <SelectItem value="En transit">En transit</SelectItem>
            <SelectItem value="Livraison en cours">Livraison en cours</SelectItem>
            <SelectItem value="Terminée">Terminée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Type de tournée
        </label>
        <Select value={tourType} onValueChange={setTourType}>
          <SelectTrigger>
            <SelectValue placeholder="Type de tournée" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Publique</SelectItem>
            <SelectItem value="private">Privée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Trier par
        </label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="departure_asc">Date de départ (croissant)</SelectItem>
            <SelectItem value="departure_desc">Date de départ (décroissant)</SelectItem>
            <SelectItem value="price_asc">Prix (croissant)</SelectItem>
            <SelectItem value="price_desc">Prix (décroissant)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}