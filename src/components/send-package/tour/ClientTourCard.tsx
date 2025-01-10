import { useState } from "react";
import { Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tour } from "@/types/tour";
import { cn } from "@/lib/utils";
import { CardCustom } from "@/components/ui/card-custom";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "@/components/auth/AuthDialog";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourRoute } from "./components/TourRoute";
import { TourExpandedContent } from "./components/TourExpandedContent";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();

  const handleBookingButtonClick = async () => {
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
      const bookingPath = `/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`;
      sessionStorage.setItem('returnPath', bookingPath);
      setShowAuthDialog(true);
      return;
    }

    const userType = session.user.user_metadata?.user_type;
    
    if (userType === 'carrier') {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Les transporteurs ne peuvent pas effectuer de réservations",
      });
      return;
    }

    navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPoint)}`);
  };

  const isBookingEnabled = () => {
    return tour.status === "Programmée" && Boolean(selectedPoint);
  };

  return (
    <CardCustom className="bg-white hover:bg-gray-50 transition-colors duration-200">
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
    </CardCustom>
  );
}