import Navigation from "@/components/Navigation";
import { TransporteurList } from "@/components/transporteur/TransporteurList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, ArrowUpDown, TruckIcon } from "lucide-react";
import { useState } from "react";

export default function Transporteurs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterCountry, setFilterCountry] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-client text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            <div className="p-4 bg-white/10 rounded-full">
              <TruckIcon className="h-12 w-12" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold">
              Des transporteurs de confiance pour vos envois
            </h1>
            <p className="text-lg sm:text-xl text-gray-100 max-w-3xl">
              Chez Colimero, nous comprenons l'importance de confier vos biens précieux 
              à des professionnels fiables. Chaque transporteur de notre réseau est 
              rigoureusement sélectionné selon des critères stricts de qualité, 
              d'expérience et de fiabilité.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-3xl mt-8">
              <div className="bg-white/10 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-2">Sélection Rigoureuse</h3>
                <p className="text-gray-100">Processus de vérification approfondi des transporteurs</p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-2">Responsabilité Totale</h3>
                <p className="text-gray-100">Suivi et sécurité garantis de vos colis</p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-2">Service Premium</h3>
                <p className="text-gray-100">Excellence et professionnalisme garantis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Bar - Spans 5 columns */}
            <div className="md:col-span-5">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Rechercher un transporteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Country Filter - Spans 4 columns */}
            <div className="md:col-span-4">
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrer par pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les pays</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="TN">Tunisie</SelectItem>
                  <SelectItem value="MA">Maroc</SelectItem>
                  <SelectItem value="DZ">Algérie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options - Spans 3 columns */}
            <div className="md:col-span-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <span>Trier par</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="rating">Mieux notés</SelectItem>
                  <SelectItem value="deliveries">Plus de livraisons</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterCountry !== "all" && (
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setFilterCountry("all")}
            >
              {filterCountry === "FR" ? "France" : 
               filterCountry === "TN" ? "Tunisie" : 
               filterCountry === "MA" ? "Maroc" : "Algérie"}
              <span className="text-xs">×</span>
            </Button>
          )}
          {searchTerm && (
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setSearchTerm("")}
            >
              Recherche: {searchTerm}
              <span className="text-xs">×</span>
            </Button>
          )}
        </div>

        {/* Transporters List */}
        <TransporteurList 
          searchTerm={searchTerm}
          sortBy={sortBy}
          filterCountry={filterCountry}
        />
      </div>
    </div>
  );
}