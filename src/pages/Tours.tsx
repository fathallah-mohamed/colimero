import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TourTimeline } from "@/components/transporteur/TourTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking/BookingForm";
import { TransporteurAvatar } from "@/components/transporteur/TransporteurAvatar";
import { TourStatus } from "@/types/tour";

export default function Tours() {
  const [departureCountry, setDepartureCountry] = useState("FR");
  const [destinationCountry, setDestinationCountry] = useState("TN");
  const [tourType, setTourType] = useState("public");
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

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

  const handleBookingClick = (tour: any) => {
    if (!selectedPickupCity) {
      return;
    }
    setSelectedTour(tour);
    setIsBookingFormOpen(true);
  };

  const isBookingDisabled = (tour: any) => {
    // Désactiver pour les administrateurs
    if (userType === 'admin') return true;
    
    // Désactiver si la tournée n'est pas en cours de collecte
    if (tour.status !== 'collecting') return true;

    // Désactiver si aucun point de collecte n'est sélectionné
    if (!selectedPickupCity) return true;

    return false;
  };

  const getBookingButtonText = (tour: any) => {
    if (!selectedPickupCity) return "Sélectionnez un point de collecte";
    if (tour.status !== 'collecting') return "Indisponible";
    if (userType === 'admin') return "Réservation non autorisée";
    return "Réserver";
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
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Pays de départ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="TN">Tunisie</SelectItem>
              </SelectContent>
            </Select>

            <ArrowLeftRight className="h-5 w-5 text-gray-400" />

            <Select value={destinationCountry} onValueChange={setDestinationCountry}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Pays de destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TN">Tunisie</SelectItem>
                <SelectItem value="FR">France</SelectItem>
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
                <div key={tour.id} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <TransporteurAvatar
                        avatarUrl={tour.carriers?.avatar_url}
                        companyName={tour.carriers?.company_name || ''}
                      />
                      <div>
                        <h3 className="font-medium">{tour.carriers?.company_name}</h3>
                        <p className="text-sm text-gray-500">
                          Départ le {format(new Date(tour.departure_date), "d MMMM", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Prix au kilo</p>
                      <p className="font-medium">
                        {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 0}€
                      </p>
                    </div>
                  </div>

                  <TourTimeline status={tour.status as TourStatus} />
                  
                  <TourCapacityDisplay
                    totalCapacity={tour.total_capacity}
                    remainingCapacity={tour.remaining_capacity}
                  />

                  {/* Points de collecte */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 text-sm text-gray-500 px-2">
                      <span>Ville</span>
                      <span>Adresse</span>
                      <span>Jour et Heure</span>
                      <span>Sélection</span>
                    </div>
                    {(tour.route as any[]).map((stop, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedPickupCity(stop.name)}
                        className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                          selectedPickupCity === stop.name
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <div className="grid grid-cols-4 items-center text-sm">
                          <span className="font-medium">{stop.name}</span>
                          <span className="text-gray-600">{stop.location}</span>
                          <span className="text-gray-600">
                            {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
                            <br />
                            {stop.time}
                          </span>
                          <div className="flex justify-center">
                            <input
                              type="radio"
                              name={`tour-${tour.id}`}
                              checked={selectedPickupCity === stop.name}
                              onChange={() => setSelectedPickupCity(stop.name)}
                              className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => handleBookingClick(tour)}
                    className="w-full"
                    disabled={isBookingDisabled(tour)}
                  >
                    {getBookingButtonText(tour)}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
        <DialogContent className="max-w-4xl h-[90vh]">
          {selectedTour && selectedPickupCity && (
            <BookingForm
              tourId={selectedTour.id}
              pickupCity={selectedPickupCity}
              destinationCountry={selectedTour.destination_country}
              onSuccess={() => setIsBookingFormOpen(false)}
              onCancel={() => setIsBookingFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}