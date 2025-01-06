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
import { Tour } from "@/types/tour";

export default function Tours() {
  const [departureCountry, setDepartureCountry] = useState("FR");
  const [destinationCountry, setDestinationCountry] = useState("TN");
  const [tourType, setTourType] = useState("public");
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);

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
      return data as Tour[];
    },
  });

  const handleBookingClick = (tour: Tour) => {
    if (!selectedPickupCity) return;
    setSelectedTour(tour);
    setIsBookingFormOpen(true);
  };

  const handleEdit = (tour: Tour) => {
    // Implement edit functionality
    console.log("Edit tour:", tour);
  };

  const handleDelete = (tourId: number) => {
    // Implement delete functionality
    console.log("Delete tour:", tourId);
  };

  const handleStatusChange = (tourId: number, newStatus: string) => {
    // Implement status change functionality
    console.log("Change status:", tourId, newStatus);
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
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                  selectedPickupCity={selectedPickupCity || ""}
                  onPickupCitySelect={setSelectedPickupCity}
                  isBookingEnabled={tour.status === "collecting"}
                  isPickupSelectionEnabled={tour.status === "collecting"}
                  bookingButtonText={getBookingButtonText(tour)}
                  onBookingClick={() => handleBookingClick(tour)}
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

function getBookingButtonText(tour: Tour): string {
  if (tour.status === 'cancelled') return "Cette tournée a été annulée";
  if (tour.status === 'planned') return "Cette tournée n'est pas encore ouverte aux réservations";
  if (tour.status === 'in_transit') return "Cette tournée est en cours de livraison";
  if (tour.status === 'completed') return "Cette tournée est terminée";
  return "Réserver sur cette tournée";
}