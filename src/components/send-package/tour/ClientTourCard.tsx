import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourDetails } from "@/components/send-package/card/TourDetails";
import { useToast } from "@/hooks/use-toast";
import { Tour } from "@/types/tour";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";

interface ClientTourCardProps {
  tour: Tour;
}

export function ClientTourCard({ tour }: ClientTourCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const handleShare = async () => {
    const tourUrl = `${window.location.origin}/tours/${tour.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Partager la tournée',
          text: 'Consultez cette tournée',
          url: tourUrl,
        });
      } else {
        await navigator.clipboard.writeText(tourUrl);
        toast({
          title: "Lien copié !",
          description: "Le lien de la tournée a été copié dans votre presse-papiers",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de partager la tournée",
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <TourDetails tour={tour} />
        
        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            onClick={() => navigate(`/tours/${tour.id}`)}
            className="flex-1 bg-primary hover:bg-primary/90 text-white min-w-[120px]"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Consulter
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Partager
          </Button>
        </div>
      </div>

      <AccessDeniedMessage 
        isOpen={showAccessDenied} 
        onClose={() => setShowAccessDenied(false)}
        userType="client"
      />
    </div>
  );
}