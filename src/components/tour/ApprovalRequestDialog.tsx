import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApprovalRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: number;
  pickupCity: string;
  onSuccess?: () => void;
}

export function ApprovalRequestDialog({
  isOpen,
  onClose,
  tourId,
  pickupCity,
  onSuccess
}: ApprovalRequestDialogProps) {
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour faire une demande d'approbation",
        });
        return;
      }

      // Vérifier s'il existe déjà une demande en attente
      const { data: existingRequest } = await supabase
        .from('approval_requests')
        .select('*')
        .eq('tour_id', tourId)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingRequest) {
        toast({
          variant: "destructive",
          title: "Demande existante",
          description: "Vous avez déjà une demande en attente pour cette tournée",
        });
        onClose();
        return;
      }

      const { error } = await supabase
        .from('approval_requests')
        .insert([
          {
            tour_id: tourId,
            user_id: user.id,
            status: 'pending',
            pickup_city: pickupCity
          }
        ]);

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande d'approbation a été envoyée avec succès",
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error submitting approval request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la demande",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demande d'approbation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Cette tournée nécessite l'approbation du transporteur. 
            Souhaitez-vous envoyer une demande d'approbation ?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              Envoyer la demande
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}