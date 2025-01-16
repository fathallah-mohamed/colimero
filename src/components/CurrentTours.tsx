import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { TourTimelineCard } from "@/components/transporteur/tour/TourTimelineCard";
import { NextTourSection } from "@/components/tour/NextTourSection";
import { useNextTour } from "@/components/tour/useNextTour";
import { useBookingFlow } from "@/components/tour/useBookingFlow";
import { TourStatus } from "@/types/tour";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function CurrentTours() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: nextTour, isLoading } = useNextTour();
  const {
    showAuthDialog,
    setShowAuthDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    handleBookingClick,
    handleAuthSuccess
  } = useBookingFlow();

  const handleStatusChange = async (tourId: number, newStatus: TourStatus) => {
    try {
      const { error } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tourId);

      if (error) throw error;

      // Invalider le cache pour forcer le rechargement des données
      await queryClient.invalidateQueries({ queryKey: ['next-tour'] });
      await queryClient.invalidateQueries({ queryKey: ['tours'] });

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la tournée a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating tour status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tournée",
      });
    }
  };

  return (
    <div className="py-8 px-4">
      <NextTourSection isLoading={isLoading} nextTour={nextTour} />

      {nextTour && (
        <TourTimelineCard 
          tour={nextTour}
          onBookingClick={handleBookingClick}
          onStatusChange={handleStatusChange}
          hideAvatar={false}
        />
      )}

      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate('/envoyer-colis')}
          variant="outline"
          className="gap-2"
        >
          Découvrir toutes nos tournées
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />

      <AccessDeniedMessage
        userType="carrier"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />
    </div>
  );
}