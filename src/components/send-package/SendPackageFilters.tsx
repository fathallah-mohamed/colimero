import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, Lock } from "lucide-react";
import type { TourStatus } from "@/types/tour";

interface SendPackageFiltersProps {
  selectedRoute: string;
  setSelectedRoute: (value: string) => void;
  selectedStatus: TourStatus | "all";
  setSelectedStatus: (value: TourStatus | "all") => void;
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
  console.log('Current status:', selectedStatus); // Debug log

  return (
    <div className="space-y-6">
      <Tabs defaultValue={tourType} onValueChange={(value) => setTourType(value as "public" | "private")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="public" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Tournées publiques
          </TabsTrigger>
          <TabsTrigger value="private" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Tournées privées
          </TabsTrigger>
        </TabsList>

        <TabsContent value="public">
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription>
              <strong>Tournées publiques :</strong> Accessibles à tous les clients, réservation immédiate possible après connexion. Idéal pour les envois standards et réguliers.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="private">
          <Alert className="mb-6 bg-purple-50 border-purple-200">
            <AlertDescription>
              <strong>Tournées privées :</strong> Nécessitent l'approbation du transporteur pour chaque réservation. Parfait pour les envois spéciaux ou les clients réguliers.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

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
              <SelectItem value="Annulée">Annulée</SelectItem>
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
    </div>
  );
}