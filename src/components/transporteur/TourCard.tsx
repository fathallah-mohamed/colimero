import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { TourCardHeader } from "./TourCardHeader";
import { TourCollectionPoints } from "./TourCollectionPoints";
import { TourCapacityDisplay } from "./TourCapacityDisplay";

interface TourCardProps {
  tour: any;
}

export function TourCard({ tour }: TourCardProps) {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const { toast } = useToast();

  const handleRequestApproval = () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour faire une demande d'approbation",
        variant: "destructive"
      });
      return;
    }
    setShowApprovalDialog(true);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <TourCardHeader tour={tour} />
      <TourCollectionPoints tour={tour} />
      <TourCapacityDisplay tour={tour} />
      
      <div className="mt-6">
        {tour.type === 'private' ? (
          <Button 
            onClick={handleRequestApproval}
            className="w-full"
          >
            Demander l'approbation
          </Button>
        ) : (
          <Button 
            onClick={() => window.location.href = `/reserver/${tour.id}`}
            className="w-full"
          >
            Réserver
          </Button>
        )}
      </div>

      <ApprovalRequestDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        tourId={tour.id}
        pickupCity={tour.route?.[0]?.name || ''}
      />
    </div>
  );
}