import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/auth/AuthDialog";
import { EmailVerificationDialog } from "@/components/tour/EmailVerificationDialog";
import { useToast } from "@/components/ui/use-toast";

export interface TransporteurToursProps {
  tours: Tour[];
  type: "public" | "private";
  isLoading: boolean;
}

export function TransporteurTours({ tours, type, isLoading }: TransporteurToursProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPoints, setSelectedPoints] = useState<Record<number, string>>({});
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
  const [currentTourId, setCurrentTourId] = useState<number | null>(null);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

  if (tours.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Aucune tournée {type === "public" ? "publique" : "privée"} disponible
      </div>
    );
  }

  const handlePointSelection = (tourId: number, cityName: string) => {
    setSelectedPoints(prev => ({
      ...prev,
      [tourId]: cityName
    }));
  };

  const handleReservation = (tourId: number) => {
    setCurrentTourId(tourId);
    if (type === "private") {
      setIsEmailVerificationOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleEmailVerification = (email: string) => {
    toast({
      title: "Email vérifié",
      description: "Nous vous contacterons prochainement pour finaliser votre réservation.",
    });
    setIsEmailVerificationOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    console.log("Réservation pour la tournée:", currentTourId, "Point sélectionné:", selectedPoints[currentTourId!]);
  };

  const getGoogleMapsUrl = (location: string, city: string) => {
    const query = encodeURIComponent(`${location}, ${city}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="space-y-4">
      {tours.map((tour) => (
        <div key={tour.id} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="text-xl font-medium">
                {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-medium">
                {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€/kg
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {tour.carriers?.avatar_url ? (
              <img
                src={tour.carriers.avatar_url}
                alt={tour.carriers.company_name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-100" />
            )}
            <span className="text-gray-600">
              {tour.carriers?.company_name}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Capacité restante : {tour.remaining_capacity} kg</span>
              <span>Total : {tour.total_capacity} kg</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${(tour.remaining_capacity / tour.total_capacity) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-4 text-sm text-gray-500 px-2">
              <span>Ville</span>
              <span>Adresse</span>
              <span>Jour et Heure</span>
              <span className="text-center">Sélection</span>
            </div>
            {tour.route.map((stop, index) => (
              <div key={index} className="grid grid-cols-4 items-center text-sm">
                <span className="font-medium">{stop.name}</span>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <a 
                    href={getGoogleMapsUrl(stop.location, stop.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    {stop.location}
                  </a>
                </div>
                <div className="text-gray-600">
                  <div>
                    {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", {
                      locale: fr,
                    })}
                  </div>
                  <div>{stop.time}</div>
                </div>
                <div className="flex justify-center">
                  <input
                    type="radio"
                    name={`tour-${tour.id}`}
                    className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    onChange={() => handlePointSelection(tour.id, stop.name)}
                    checked={selectedPoints[tour.id] === stop.name}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500">
            Départ pour la{" "}
            {tour.destination_country === "TN" ? "Tunisie" : "France"} :{" "}
            {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
          </div>

          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={() => handleReservation(tour.id)}
            disabled={!selectedPoints[tour.id]}
          >
            {selectedPoints[tour.id] ? "Réserver" : "Sélectionnez un point de collecte"}
          </Button>
        </div>
      ))}

      <AuthDialog 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <EmailVerificationDialog
        isOpen={isEmailVerificationOpen}
        onClose={() => setIsEmailVerificationOpen(false)}
        onVerify={handleEmailVerification}
      />
    </div>
  );
}