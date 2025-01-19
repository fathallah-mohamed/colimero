import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BookingConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  responsibilityAccepted: boolean;
  onResponsibilityChange: (checked: boolean) => void;
  onConfirm: () => void;
}

export function BookingConfirmDialog({
  open,
  onOpenChange,
  responsibilityAccepted,
  onResponsibilityChange,
  onConfirm,
}: BookingConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation de réservation</DialogTitle>
          <DialogDescription>
            Veuillez lire attentivement et accepter les conditions suivantes avant de confirmer votre réservation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="responsibility"
                checked={responsibilityAccepted}
                onCheckedChange={(checked) => onResponsibilityChange(checked as boolean)}
              />
              <Label htmlFor="responsibility" className="text-sm leading-relaxed">
                Je reconnais que Colimero ne peut être tenu responsable du contenu de mon colis ni des éventuelles infractions liées à son transport. Toute responsabilité repose sur moi en tant qu'expéditeur.
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={!responsibilityAccepted}
          >
            Confirmer la réservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}