import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EnvoyerColis() {
  const [departureCountry, setDepartureCountry] = useState("FR");
  const [destinationCountry, setDestinationCountry] = useState("TN");
  const [tourType, setTourType] = useState("public");
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const { data: tours, isLoading } = useQuery({
    queryKey: ["tours", departureCountry, destinationCountry, tourType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          carriers (
            company_name,
            avatar_url,
            carrier_capacities (
              price_per_kg
            )
          )
        `)
        .eq("departure_country", departureCountry)
        .eq("destination_country", destinationCountry)
        .eq("type", tourType)
        .order("departure_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleReservationClick = () => {
    setLoginDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Nos Tournées</h1>

        <div className="space-y-6">
          {/* Filtres */}
          <div className="flex items-center gap-2">
            <Select value={departureCountry} onValueChange={setDepartureCountry}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Pays de départ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="TN">Tunisie</SelectItem>
                <SelectItem value="DZ">Algérie</SelectItem>
                <SelectItem value="MA">Maroc</SelectItem>
              </SelectContent>
            </Select>

            <ArrowLeftRight className="h-5 w-5 text-gray-400" />

            <Select value={destinationCountry} onValueChange={setDestinationCountry}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Pays de destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TN">Tunisie</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="DZ">Algérie</SelectItem>
                <SelectItem value="MA">Maroc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Onglets */}
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                tourType === "public"
                  ? "bg-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setTourType("public")}
            >
              Tournées Publiques ({tours?.filter(t => t.type === "public").length || 0})
            </button>
            <button
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                tourType === "private"
                  ? "bg-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setTourType("private")}
            >
              Tournées Privées ({tours?.filter(t => t.type === "private").length || 0})
            </button>
          </div>

          {/* Liste des tournées */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Chargement des tournées...</div>
            ) : tours?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune tournée disponible pour cette sélection
              </div>
            ) : (
              tours?.map((tour) => (
                <div key={tour.id} className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">
                        {format(new Date(tour.departure_date), "d MMMM", { locale: fr })}
                      </span>
                    </div>
                    <span className="text-gray-600">
                      {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€/kg
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex-shrink-0">
                      {tour.carriers?.avatar_url ? (
                        <img
                          src={tour.carriers.avatar_url}
                          alt={tour.carriers.company_name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="text-sm text-gray-600">{tour.carriers?.company_name}</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Capacité restante : {tour.remaining_capacity} kg</span>
                      <span>Total : {tour.total_capacity} kg</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${(tour.remaining_capacity / tour.total_capacity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Points de collecte */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 text-sm text-gray-500 px-2">
                      <span>Ville</span>
                      <span>Adresse</span>
                      <span>Jour et Heure</span>
                      <span>Sélection</span>
                    </div>
                    {(tour.route as any[]).map((stop, index) => (
                      <div key={index} className="grid grid-cols-4 items-center text-sm">
                        <span className="font-medium">{stop.name}</span>
                        <span className="text-gray-600">{stop.location}</span>
                        <span className="text-gray-600">
                          {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
                          <br />
                          {stop.time}
                        </span>
                        <div className="flex justify-center">
                          <button 
                            className={`h-4 w-4 rounded-full border transition-colors ${
                              selectedStop === `${tour.id}-${index}` 
                                ? "bg-blue-500 border-blue-500" 
                                : "border-gray-300 hover:border-blue-500"
                            }`}
                            onClick={() => setSelectedStop(`${tour.id}-${index}`)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    Départ pour la {destinationCountry === "TN" ? "Tunisie" : "France"} : {" "}
                    {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
                  </div>

                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
                      if (selectedStop?.startsWith(tour.id.toString())) {
                        handleReservationClick();
                      }
                    }}
                  >
                    {selectedStop?.startsWith(tour.id.toString()) ? "Réserver" : "Sélectionnez un point de collecte"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dialog de connexion */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connexion requise</DialogTitle>
            <DialogDescription>
              Connectez-vous pour réserver cette tournée.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="exemple@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" />
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              Se connecter
            </Button>
            <div className="flex justify-between text-sm text-blue-500">
              <button className="hover:underline">Mot de passe oublié ?</button>
              <button className="hover:underline">Créer un compte</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}