import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApprovalRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: number;
  pickupCity: string;
}

export function ApprovalRequestDialog({
  isOpen,
  onClose,
  tourId,
  pickupCity,
}: ApprovalRequestDialogProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour faire une demande d'approbation",
        });
        return;
      }

      const { error } = await supabase
        .from('approval_requests')
        .insert({
          user_id: user.id,
          tour_id: tourId,
          status: 'pending',
          message: message.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Le transporteur va analyser votre demande. Vous serez notifié par email de sa décision.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting approval request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la demande",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Demande d'approbation
          </DialogTitle>
          <p className="text-gray-600">
            Cette tournée nécessite l'approbation du transporteur. Envoyez une demande pour pouvoir réserver.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="font-medium mb-1">Point de collecte sélectionné</p>
            <p className="text-gray-600">{pickupCity}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="font-medium">
              Message au transporteur (optionnel)
            </label>
            <Textarea
              id="message"
              placeholder="Ajoutez un message personnalisé..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}