import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TourCapacityDisplay } from "./transporteur/TourCapacityDisplay";
import { TourTimeline } from "./transporteur/TourTimeline";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingForm } from "./booking/BookingForm";
import { Tour, TourStatus, RouteStop } from "@/types/tour";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurAvatar } from "./transporteur/TransporteurAvatar";

export default function CurrentTours() {
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkUserType = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserType(user.user_metadata?.user_type);
      }
    };
    checkUserType();
  }, []);

  const { data: tours, isLoading } = useQuery({
    queryKey: ["current-tours"],
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
        .eq("type", "public")
        .gte("departure_date", new Date().toISOString())
        .order("departure_date", { ascending: true });

      if (error) throw error;
      
      return data.map(tour => ({
        ...tour,
        route: Array.isArray(tour.route) ? tour.route : JSON.parse(tour.route as string),
        carriers: {
          ...tour.carriers,
          carrier_capacities: Array.isArray(tour.carriers?.carrier_capacities) 
            ? tour.carriers.carrier_capacities 
            : [tour.carriers?.carrier_capacities]
        }
      })) as Tour[];
    },
  });

  const handleBookingClick = (tour: Tour) => {
    if (!selectedPickupCity) {
      return;
    }
    setSelectedTour(tour);
    setIsBookingFormOpen(true);
  };

  const isBookingDisabled = (tour: Tour) => {
    // Désactiver pour les administrateurs
    if (userType === 'admin') return true;
    
    // Désactiver si la tournée n'est pas en cours de collecte
    if (tour.status !== 'collecting') return true;

    // Désactiver si aucun point de collecte n'est sélectionné
    if (!selectedPickupCity) return true;

    return false;
  };

  const getBookingButtonText = (tour: Tour) => {
    if (!selectedPickupCity) return "Sélectionnez un point de collecte";
    if (tour.status !== 'collecting') return "Indisponible";
    if (userType === 'admin') return "Réservation non autorisée";
    return "Réserver";
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8">Tournées en cours</h2>
        {isLoading ? (
          <div>Chargement des tournées...</div>
        ) : !tours?.length ? (
          <div>Aucune tournée disponible</div>
        ) : (
          <div className="grid gap-6">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <TransporteurAvatar
                      avatarUrl={tour.carriers?.avatar_url}
                      companyName={tour.carriers?.company_name}
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

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
                  <div className="space-y-2">
                    {(tour.route as RouteStop[]).map((stop, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedPickupCity(stop.name)}
                        className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                          selectedPickupCity === stop.name
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{stop.name}</p>
                            <p className="text-sm text-gray-500">{stop.location}</p>
                          </div>
                          <p className="text-sm text-gray-500">{stop.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Button 
                    onClick={() => handleBookingClick(tour)}
                    className="w-full"
                    disabled={isBookingDisabled(tour)}
                  >
                    {getBookingButtonText(tour)}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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