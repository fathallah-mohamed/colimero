import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, Lock, MapPin, Package2, ArrowUpDown, Calendar } from "lucide-react";
import type { TourStatus } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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

  // Fonction pour obtenir le texte du trajet sélectionné
  const getRouteDisplayText = (route: string) => {
    switch (route) {
      case "FR_TO_TN":
        return "France → Tunisie";
      case "TN_TO_FR":
        return "Tunisie → France";
      default:
        return "Sélectionner";
    }
  };

  // Fonction pour obtenir le texte du tri sélectionné
  const getSortDisplayText = (sort: string) => {
    switch (sort) {
      case "departure_asc":
        return "Date ↑";
      case "departure_desc":
        return "Date ↓";
      case "price_asc":
        return "Prix ↑";
      case "price_desc":
        return "Prix ↓";
      default:
        return "Trier";
    }
  };

  return (
    <div className="space-y-4">
      {/* Version Mobile - Style Airbnb/Uber */}
      <div className="lg:hidden">
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="flex gap-2 justify-between">
            <Button 
              variant="outline" 
              className="flex-1 justify-start h-14 px-4 border-gray-200 hover:bg-gray-50"
              onClick={() => {
                const sheet = document.getElementById('route-sheet');
                if (sheet) {
                  (sheet as any).click();
                }
              }}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Trajet</span>
                <span className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {getRouteDisplayText(selectedRoute)}
                </span>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="flex-1 justify-start h-14 px-4 border-gray-200 hover:bg-gray-50"
              onClick={() => {
                const sheet = document.getElementById('status-sheet');
                if (sheet) {
                  (sheet as any).click();
                }
              }}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Statut</span>
                <span className="text-sm font-medium flex items-center gap-2">
                  <Package2 className="h-4 w-4" />
                  {selectedStatus === "all" ? "Tous" : selectedStatus}
                </span>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="flex-1 justify-start h-14 px-4 border-gray-200 hover:bg-gray-50"
              onClick={() => setSortBy(sortBy.includes('asc') ? sortBy.replace('asc', 'desc') : sortBy.replace('desc', 'asc'))}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Trier par</span>
                <span className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {getSortDisplayText(sortBy)}
                </span>
              </div>
            </Button>
          </div>
        </div>

        {/* Sheets for mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <button id="route-sheet" className="hidden">Route Sheet</button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[40vh]">
            <SheetHeader>
              <SheetTitle>Sélectionner le trajet</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <Button
                variant={selectedRoute === "FR_TO_TN" ? "default" : "ghost"}
                onClick={() => setSelectedRoute("FR_TO_TN")}
                className="w-full justify-start h-14 text-lg"
              >
                <MapPin className="h-5 w-5 mr-3" />
                France → Tunisie
              </Button>
              <Button
                variant={selectedRoute === "TN_TO_FR" ? "default" : "ghost"}
                onClick={() => setSelectedRoute("TN_TO_FR")}
                className="w-full justify-start h-14 text-lg"
              >
                <MapPin className="h-5 w-5 mr-3" />
                Tunisie → France
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <button id="status-sheet" className="hidden">Status Sheet</button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh]">
            <SheetHeader>
              <SheetTitle>Filtrer par statut</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              {["Programmée", "Ramassage en cours", "En transit", "Livraison en cours", "Terminée", "Annulée"].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "ghost"}
                  onClick={() => setSelectedStatus(status as TourStatus)}
                  className="w-full justify-start h-14 text-lg"
                >
                  <Package2 className="h-5 w-5 mr-3" />
                  {status}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Version Desktop - Style Airbnb/Uber */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <Tabs defaultValue={tourType} onValueChange={(value) => setTourType(value as "public" | "private")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 h-14">
              <TabsTrigger value="public" className="flex items-center gap-2 text-base">
                <Globe className="h-5 w-5" />
                Tournées publiques
              </TabsTrigger>
              <TabsTrigger value="private" className="flex items-center gap-2 text-base">
                <Lock className="h-5 w-5" />
                Tournées privées
              </TabsTrigger>
            </TabsList>

            <TabsContent value="public">
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <AlertDescription>
                  <strong>Tournées publiques :</strong> Accessibles à tous les clients, réservation immédiate possible après connexion.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="private">
              <Alert className="mb-6 bg-purple-50 border-purple-200">
                <AlertDescription>
                  <strong>Tournées privées :</strong> Nécessitent l'approbation du transporteur pour chaque réservation.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-3 gap-4">
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger className="h-14">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <SelectValue placeholder="Sélectionner un trajet" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FR_TO_TN">France → Tunisie</SelectItem>
                <SelectItem value="TN_TO_FR">Tunisie → France</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-14">
                <div className="flex items-center gap-2">
                  <Package2 className="h-5 w-5" />
                  <SelectValue placeholder="Filtrer par statut" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Programmée">Programmée</SelectItem>
                <SelectItem value="Ramassage en cours">Ramassage en cours</SelectItem>
                <SelectItem value="En transit">En transit</SelectItem>
                <SelectItem value="Livraison en cours">Livraison en cours</SelectItem>
                <SelectItem value="Terminée">Terminée</SelectItem>
                <SelectItem value="Annulée">Annulée</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-14">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <SelectValue placeholder="Trier par" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="departure_asc">Date (croissant)</SelectItem>
                <SelectItem value="departure_desc">Date (décroissant)</SelectItem>
                <SelectItem value="price_asc">Prix (croissant)</SelectItem>
                <SelectItem value="price_desc">Prix (décroissant)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}