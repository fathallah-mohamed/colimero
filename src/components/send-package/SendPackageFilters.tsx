import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, Lock, MapPin, Package2, ArrowUpDown } from "lucide-react";
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
  React.useEffect(() => {
    if (selectedStatus === "all") {
      setSelectedStatus("Programmée");
    }
  }, []);

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
      {/* Version Mobile */}
      <div className="lg:hidden">
        <div className="flex flex-wrap gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {getRouteDisplayText(selectedRoute)}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[50vh]">
              <SheetHeader>
                <SheetTitle>Sélectionner le trajet</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Button
                  variant={selectedRoute === "FR_TO_TN" ? "default" : "ghost"}
                  onClick={() => setSelectedRoute("FR_TO_TN")}
                  className="w-full justify-start"
                >
                  France → Tunisie
                </Button>
                <Button
                  variant={selectedRoute === "TN_TO_FR" ? "default" : "ghost"}
                  onClick={() => setSelectedRoute("TN_TO_FR")}
                  className="w-full justify-start"
                >
                  Tunisie → France
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Package2 className="h-4 w-4" />
                {selectedStatus === "all" ? "Tous" : selectedStatus}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <SheetHeader>
                <SheetTitle>Filtrer par statut</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {["Programmée", "Ramassage en cours", "En transit", "Livraison en cours", "Terminée", "Annulée"].map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "ghost"}
                    onClick={() => setSelectedStatus(status as TourStatus)}
                    className="w-full justify-start"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setSortBy(sortBy.includes('asc') ? sortBy.replace('asc', 'desc') : sortBy.replace('desc', 'asc'))}
          >
            <ArrowUpDown className="h-4 w-4" />
            {getSortDisplayText(sortBy)}
          </Button>
        </div>
      </div>

      {/* Version Desktop */}
      <div className="hidden lg:block">
        <Tabs defaultValue={tourType} onValueChange={(value) => setTourType(value as "public" | "private")} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
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
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un trajet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FR_TO_TN">France → Tunisie</SelectItem>
              <SelectItem value="TN_TO_FR">Tunisie → France</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut" />
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
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
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
  );
}