import React from 'react';
import { Flag, Calendar } from "lucide-react";
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
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Sélectionner un trajet" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FR_TO_TN">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-gray-500" />
                <span>France → Tunisie</span>
              </div>
            </SelectItem>
            <SelectItem value="TN_TO_FR">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-gray-500" />
                <span>Tunisie → France</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Statut
        </label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Filtrer par statut" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Tous les statuts</span>
              </div>
            </SelectItem>
            <SelectItem value="Programmé">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Programmé</span>
              </div>
            </SelectItem>
            <SelectItem value="Ramassage en cours">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Ramassage en cours</span>
              </div>
            </SelectItem>
            <SelectItem value="En transit">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>En transit</span>
              </div>
            </SelectItem>
            <SelectItem value="Livraison en cours">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Livraison en cours</span>
              </div>
            </SelectItem>
            <SelectItem value="Livraison terminée">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Livraison terminée</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}