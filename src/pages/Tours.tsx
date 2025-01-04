import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking/BookingForm";
import { TourCard } from "@/components/tour/TourCard";
import { Tour, RouteStop } from "@/types/tour";

export default function Tours() {
  const [departureCountry, setDepartureCountry] = useState("FR");
  const [destinationCountry, setDestinationCountry] = useState("TN");
  const [tourType, setTourType] = useState("public");
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
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
      
      // Transform the data to match the Tour interface
      return data.map(tour => {
        // Ensure route is properly parsed as RouteStop[]
        let parsedRoute: RouteStop[];
        if (typeof tour.route === 'string') {
          const parsed = JSON.parse(tour.route);
          parsedRoute = parsed.map((stop: any) => ({
            name: String(stop.name || ''),
            location: String(stop.location || ''),
            time: String(stop.time || ''),
            type: (stop.type === 'pickup' || stop.type === 'dropoff') ? stop.type : 'pickup',
            collection_date: tour.collection_date // Use the tour's collection date for each stop
          }));
        } else if (Array.isArray(tour.route)) {
          parsedRoute = tour.route.map((stop: any) => ({
            name: String(stop.name || ''),
            location: String(stop.location || ''),
            time: String(stop.time || ''),
            type: (stop.type === 'pickup' || stop.type === 'dropoff') ? stop.type : 'pickup',
            collection_date: tour.collection_date // Use the tour's collection date for each stop
          }));
        } else if (typeof tour.route === 'object' && tour.route !== null) {
          // If it's a JSONB object from Supabase, convert it to array
          parsedRoute = Object.values(tour.route).map((stop: any) => ({
            name: String(stop.name || ''),
            location: String(stop.location || ''),
            time: String(stop.time || ''),
            type: (stop.type === 'pickup' || stop.type === 'dropoff') ? stop.type : 'pickup',
            collection_date: tour.collection_date // Use the tour's collection date for each stop
          }));
        } else {
          parsedRoute = [];
        }

        return {
          ...tour,
          route: parsedRoute,
          carriers: tour.carriers ? {
            ...tour.carriers,
            carrier_capacities: Array.isArray(tour.carriers.carrier_capacities)
              ? tour.carriers.carrier_capacities
              : [tour.carriers.carrier_capacities]
          } : null
        } as Tour;
      });
    },
  });

  const handleBookingClick = (tour: Tour) => {
    if (!selectedPickupCity || !isBookingEnabled(tour)) {
      return;
    }
    setSelectedTour(tour);
    setIsBookingFormOpen(true);
  };

  const isBookingEnabled = (tour: Tour) => {
    return tour.status === 'collecting' && userType !== 'admin';
  };

  const isPickupSelectionEnabled = (tour: Tour) => {
    return tour.status === 'collecting' && userType !== 'admin';
  };

  const getBookingButtonText = (tour: Tour) => {
    if (tour.status === 'cancelled') return "Cette tournée a été annulée";
    if (userType === 'admin') return "Les administrateurs ne peuvent pas effectuer de réservations";
    if (tour.status === 'planned') return "Cette tournée n'est pas encore ouverte aux réservations";
    if (tour.status === 'in_transit') return "Cette tournée est en cours de livraison";
    if (tour.status === 'completed') return "Cette tournée est terminée";
    if (!selectedPickupCity) return "Sélectionnez un point de collecte pour réserver";
    return "Réserver sur cette tournée";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Nos Tournées</h1>

        <div className="space-y-6">
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

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Chargement des tournées...</div>
            ) : tours?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune tournée disponible pour cette sélection
              </div>
            ) : (
              tours?.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  selectedPickupCity={selectedPickupCity}
                  onPickupCitySelect={setSelectedPickupCity}
                  onBookingClick={() => handleBookingClick(tour)}
                  isBookingEnabled={isBookingEnabled(tour)}
                  isPickupSelectionEnabled={isPickupSelectionEnabled(tour)}
                  bookingButtonText={getBookingButtonText(tour)}
                />
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