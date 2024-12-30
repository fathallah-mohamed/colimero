import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/auth/AuthDialog";
import { EmailVerificationDialog } from "@/components/tour/EmailVerificationDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking/BookingForm";
import { TourCapacityDisplay } from "./TourCapacityDisplay";
import { TransporteurAvatar } from "./TransporteurAvatar";

type TransporteurToursProps = {
  tours: Tour[];
  type: "public" | "private";
  isLoading: boolean;
};

export function TransporteurTours({ tours, type, isLoading }: TransporteurToursProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPoints, setSelectedPoints] = useState<Record<number, string>>({});
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
  const [currentTourId, setCurrentTourId] = useState<number | null>(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const handlePointSelection = (tourId: number, cityName: string) => {
    setSelectedPoints(prev => ({
      ...prev,
      [tourId]: cityName
    }));
  };

  const handleReservation = async (tourId: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const userType = session.user.user_metadata?.user_type;
      
      if (userType === 'carrier') {
        setShowAccessDenied(true);
        return;
      }

      setCurrentTourId(tourId);
      setIsBookingFormOpen(true);
      return;
    }

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
    setIsBookingFormOpen(true);
  };

  const getGoogleMapsUrl = (location: string, city: string) => {
    const query = encodeURIComponent(`${location}, ${city}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const handleBookingSuccess = () => {
    setIsBookingFormOpen(false);
    navigate("/mes-reservations");
  };

  const currentTour = tours.find(tour => tour.id === currentTourId);

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

  return (
    <div className="space-y-4">
      {showAccessDenied && <AccessDeniedMessage userType="client" />}

      {tours.map((tour) => (
        <div key={tour.id} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-medium">
                {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-medium">
                {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€/kg
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TransporteurAvatar
              avatarUrl={tour.carriers?.avatar_url}
              name={tour.carriers?.company_name || ""}
              size="sm"
            />
            <span className="text-gray-600">
              {tour.carriers?.company_name}
            </span>
          </div>

          <TourCapacityDisplay 
            remainingCapacity={tour.remaining_capacity} 
            totalCapacity={tour.total_capacity}
          />

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
                    {format(new Date(stop.collection_date), "EEEE d MMMM yyyy", {
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
            {tour.destination_country === "TN" ? "Tunisie" : "France"} le{" "}
            {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
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
        requiredUserType="client"
      />

      <EmailVerificationDialog
        isOpen={isEmailVerificationOpen}
        onClose={() => setIsEmailVerificationOpen(false)}
        onVerify={handleEmailVerification}
      />

      <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {currentTourId && selectedPoints[currentTourId] && currentTour && (
            <BookingForm
              tourId={currentTourId}
              pickupCity={selectedPoints[currentTourId]}
              destinationCountry={currentTour.destination_country}
              onSuccess={handleBookingSuccess}
              onCancel={() => setIsBookingFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
