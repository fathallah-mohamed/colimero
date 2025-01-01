import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ApprovalRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: number;
  userProfile: any;
}

export function ApprovalRequestDialog({
  isOpen,
  onClose,
  tourId,
  userProfile,
}: ApprovalRequestDialogProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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

      const { error } = await supabase
        .from('approval_requests')
        .insert({
          user_id: user.id,
          tour_id: tourId,
          message: message.trim(),
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Le transporteur va analyser votre demande. Vous serez notifié par email de sa décision.",
      });

      onClose();
    } catch (error: any) {
      console.error('Error submitting approval request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la demande",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Demande d'approbation pour tournée privée</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Vos informations</h3>
              <div className="space-y-2 text-sm">
                <p>Nom : {userProfile?.first_name} {userProfile?.last_name}</p>
                <p>Email : {userProfile?.email}</p>
                <p>Téléphone : {userProfile?.phone}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="font-medium">
                Message pour le transporteur (optionnel)
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez vos besoins spécifiques pour cette tournée..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer la demande"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}