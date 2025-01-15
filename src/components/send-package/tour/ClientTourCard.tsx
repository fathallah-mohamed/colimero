import { useState } from "react";
import { Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { cn } from "@/lib/utils";
import { CardCustom } from "@/components/ui/card-custom";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "@/components/auth/AuthDialog";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourRoute } from "./components/TourRoute";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkExistingBooking = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: existingBooking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('tour_id', tour.id)
      .eq('user_id', session.user.id)
      .neq('status', 'cancelled')
      .maybeSingle();

    if (error) {
      console.error('Error checking existing booking:', error);
      return null;
    }

    return existingBooking;
  };

  const handleBookingButtonClick = async () => {
    console.log("handleBookingButtonClick called");
    
    if (!selectedPoint) {
      toast({
        variant: "destructive",
        title: "Point de ramassage requis",
        description: "Veuillez sélectionner un point de ramassage avant de réserver",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("No session, showing auth dialog");
      const bookingPath = `/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`;
      sessionStorage.setItem('returnPath', bookingPath);
      setShowAuthDialog(true);
      return;
    }

    const userType = session.user.user_metadata?.user_type;
    console.log("User type:", userType);
    
    if (userType === 'carrier') {
      console.log("User is carrier, showing access denied");
      setShowAccessDeniedDialog(true);
      return;
    }

    // Vérifier si l'utilisateur a déjà une réservation active sur cette tournée
    const existingBooking = await checkExistingBooking();
    
    if (existingBooking) {
      toast({
        variant: "destructive",
        title: "Réservation impossible",
        description: "Vous avez déjà une réservation en cours sur cette tournée. Veuillez choisir une autre tournée ou annuler votre réservation existante.",
      });
      return;
    }

    console.log("Navigating to booking page");
    navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`);
  };

  const isBookingEnabled = () => {
    return tour.status === "Programmée" && Boolean(selectedPoint);
  };

  return (
    <CardCustom className="bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md">
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <TourMainInfo tour={tour} />
          <TourRoute tour={tour} />

          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-colors group"
          >
            <Eye className="h-5 w-5 mr-2 text-blue-500 group-hover:text-blue-600" />
            {isExpanded ? "Masquer les informations" : "Voir les informations détaillées"}
            <ChevronDown className={cn(
              "h-5 w-5 ml-2 text-blue-500 transition-transform duration-200 group-hover:text-blue-600",
              isExpanded && "rotate-180"
            )} />
          </Button>

          {isExpanded && (
            <TourExpandedContent
              tour={tour}
              selectedPoint={selectedPoint}
              onPointSelect={setSelectedPoint}
              onBookingClick={handleBookingButtonClick}
              isBookingEnabled={isBookingEnabled()}
            />
          )}
        </div>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          if (selectedPoint) {
            navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`);
          }
        }}
        requiredUserType="client"
      />

      <AccessDeniedMessage
        userType="carrier"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />
    </CardCustom>
  );
}