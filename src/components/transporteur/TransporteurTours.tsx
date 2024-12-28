import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BookingForm } from "../booking/BookingForm";
import { LoginForm } from "../auth/LoginForm";
import { Json } from "@/integrations/supabase/types";

interface RouteStop {
  name: string;
  location: string;
  time: string;
  type: 'pickup' | 'dropoff';
}

interface Tour {
  id: number;
  departure_date: string;
  departure_country: string;
  destination_country: string;
  remaining_capacity: number;
  total_capacity: number;
  route: RouteStop[];
}

interface TransporteurToursProps {
  tours: Tour[];
  type: "public" | "private";
}

export function TransporteurTours({ tours, type }: TransporteurToursProps) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { toast } = useToast();
  const title = type === "public" ? "Tournées Publiques" : "Tournées Privées";
  const buttonText = type === "public" ? "Réserver" : "Demander un accès";

  const handleBookingClick = async (tour: Tour) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setSelectedTour(tour);
      setShowLoginDialog(true);
      return;
    }

    // Vérifier si l'utilisateur est un transporteur
    const { data: carrier } = await supabase
      .from("carriers")
      .select("id")
      .eq("id", user.id)
      .single();

    if (carrier) {
      toast({
        variant: "destructive",
        title: "Action non autorisée",
        description: "Un transporteur ne peut pas réserver de tournée",
      });
      return;
    }

    setSelectedTour(tour);
    setShowBookingForm(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    if (selectedTour) {
      setShowBookingForm(true);
    }
  };

  if (!tours.length) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        <p className="text-center text-gray-500 py-4">
          Aucune tournée {type === "public" ? "publique" : "privée"} disponible
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        <div className="space-y-4">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="border rounded-lg p-4 hover:border-[#00B0F0] transition-colors"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#00B0F0]" />
                  <div>
                    <p className="font-medium">
                      {format(new Date(tour.departure_date), "d MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tour.departure_country} vers {tour.destination_country}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => handleBookingClick(tour)}
                >
                  {buttonText}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00B0F0]"
                    style={{
                      width: `${(tour.remaining_capacity / tour.total_capacity) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {tour.remaining_capacity}kg / {tour.total_capacity}kg
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connexion requise</DialogTitle>
          </DialogHeader>
          <LoginForm onSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réserver une place</DialogTitle>
          </DialogHeader>
          {selectedTour && (
            <BookingForm
              tourId={selectedTour.id}
              pickupCity={selectedCity || (selectedTour.route[0] as RouteStop).name}
              onSuccess={() => setShowBookingForm(false)}
              onCancel={() => setShowBookingForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}