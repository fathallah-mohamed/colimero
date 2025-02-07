import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, Lock, MapPin, Clock } from "lucide-react";
import type { TourStatus } from "@/types/tour";
import { Badge } from "@/components/ui/badge";

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
  React.useEffect(() => {
    if (selectedStatus === "all") {
      setSelectedStatus("Programmée");
    }
  }, []);

  const routes = [
    { value: "FR_TO_TN", label: "France → Tunisie", icon: "🇫🇷 → 🇹🇳" },
    { value: "TN_TO_FR", label: "Tunisie → France", icon: "🇹🇳 → 🇫🇷" }
  ];

  const statuses = [
    { value: "Programmée", label: "Programmée", color: "bg-blue-500" },
    { value: "Ramassage en cours", label: "Ramassage", color: "bg-yellow-500" },
    { value: "En transit", label: "En transit", color: "bg-purple-500" },
    { value: "Livraison en cours", label: "Livraison", color: "bg-green-500" },
    { value: "Terminée", label: "Terminée", color: "bg-gray-500" },
    { value: "Annulée", label: "Annulée", color: "bg-red-500" }
  ];

  console.log('Current route selection:', selectedRoute);

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

      <div className="grid gap-6">
        {/* Route Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            Trajet
          </label>
          <div className="flex flex-wrap gap-2">
            {routes.map((route) => (
              <button
                key={route.value}
                onClick={() => {
                  console.log('Setting route to:', route.value);
                  setSelectedRoute(route.value);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedRoute === route.value
                    ? "bg-primary text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-2">{route.icon}</span>
                {route.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            Statut
          </label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value as TourStatus)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedStatus === status.value
                    ? "ring-2 ring-primary ring-offset-2 shadow-md scale-105"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${status.color}`} />
                  {status.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="w-full sm:w-72">
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