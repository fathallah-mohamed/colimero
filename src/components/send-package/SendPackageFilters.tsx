import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SendPackageFiltersProps {
  selectedRoute: string;
  setSelectedRoute: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
}

export function SendPackageFilters({
  selectedRoute,
  setSelectedRoute,
  selectedStatus,
  setSelectedStatus
}: SendPackageFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
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
            <SelectItem value="Programmé">Programmé</SelectItem>
            <SelectItem value="Ramassage en cours">Ramassage en cours</SelectItem>
            <SelectItem value="En transit">En transit</SelectItem>
            <SelectItem value="Livraison en cours">Livraison en cours</SelectItem>
            <SelectItem value="Livraison terminée">Livraison terminée</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}