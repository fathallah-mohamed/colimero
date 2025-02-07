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
  const [openRoute, setOpenRoute] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [openType, setOpenType] = React.useState(false);

  React.useEffect(() => {
    if (selectedStatus === "all") {
      setSelectedStatus("Programmée");
    }
  }, []);

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

  const handleRouteSelect = (route: string) => {
    setSelectedRoute(route);
    setOpenRoute(false);
  };

  const handleStatusSelect = (status: TourStatus) => {
    setSelectedStatus(status);
    setOpenStatus(false);
  };

  const handleTypeSelect = (type: "public" | "private") => {
    setTourType(type);
    setOpenType(false);
  };

  return (
    <div className="space-y-4">
      {/* Version Mobile */}
      <div className="lg:hidden">
        <div className="flex flex-wrap gap-2">
          <Sheet open={openType} onOpenChange={setOpenType}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {tourType === "public" ? (
                  <Globe className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {tourType === "public" ? "Publique" : "Privée"}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl bg-white p-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-semibold text-center">Type de tournée</SheetTitle>
              </SheetHeader>
              <div className="grid gap-3">
                <Button
                  variant={tourType === "public" ? "default" : "outline"}
                  onClick={() => handleTypeSelect("public")}
                  className="w-full h-12 text-base flex items-center gap-2 justify-center"
                >
                  <Globe className="h-4 w-4" />
                  Tournées publiques
                </Button>
                <Button
                  variant={tourType === "private" ? "default" : "outline"}
                  onClick={() => handleTypeSelect("private")}
                  className="w-full h-12 text-base flex items-center gap-2 justify-center"
                >
                  <Lock className="h-4 w-4" />
                  Tournées privées
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={openRoute} onOpenChange={setOpenRoute}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {getRouteDisplayText(selectedRoute)}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl bg-white p-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-semibold text-center">Sélectionner le trajet</SheetTitle>
              </SheetHeader>
              <div className="grid gap-3">
                <Button
                  variant={selectedRoute === "FR_TO_TN" ? "default" : "outline"}
                  onClick={() => handleRouteSelect("FR_TO_TN")}
                  className="w-full h-12 text-base"
                >
                  France → Tunisie
                </Button>
                <Button
                  variant={selectedRoute === "TN_TO_FR" ? "default" : "outline"}
                  onClick={() => handleRouteSelect("TN_TO_FR")}
                  className="w-full h-12 text-base"
                >
                  Tunisie → France
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={openStatus} onOpenChange={setOpenStatus}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Package2 className="h-4 w-4" />
                {selectedStatus === "all" ? "Tous" : selectedStatus}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl bg-white p-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-semibold text-center">Filtrer par statut</SheetTitle>
              </SheetHeader>
              <div className="grid gap-3">
                {["Programmée", "Ramassage en cours", "En transit", "Livraison en cours", "Terminée", "Annulée"].map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    onClick={() => handleStatusSelect(status as TourStatus)}
                    className="w-full h-12 text-base justify-start px-4"
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