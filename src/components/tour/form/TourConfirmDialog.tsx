import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TourConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function TourConfirmDialog({ open, onOpenChange, onConfirm }: TourConfirmDialogProps) {
  const [confirmChecks, setConfirmChecks] = useState({
    info_accuracy: false,
    transport_responsibility: false,
    platform_rules: false,
    safety_confirmation: false,
  });

  const handleConfirm = () => {
    if (Object.values(confirmChecks).every(check => check)) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmation de création de la tournée</DialogTitle>
          <DialogDescription>
            Veuillez confirmer les points suivants avant de créer la tournée
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="info_accuracy"
              checked={confirmChecks.info_accuracy}
              onCheckedChange={(checked) => 
                setConfirmChecks(prev => ({ ...prev, info_accuracy: checked as boolean }))
              }
            />
            <Label htmlFor="info_accuracy" className="text-sm leading-none">
              Je certifie que toutes les informations saisies pour cette tournée sont exactes et conformes à la réalité.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="transport_responsibility"
              checked={confirmChecks.transport_responsibility}
              onCheckedChange={(checked) => 
                setConfirmChecks(prev => ({ ...prev, transport_responsibility: checked as boolean }))
              }
            />
            <Label htmlFor="transport_responsibility" className="text-sm leading-none">
              Je reconnais être seul(e) responsable des objets transportés dans cette tournée, et je m'engage à respecter toutes les lois et réglementations applicables au transport de marchandises.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="platform_rules"
              checked={confirmChecks.platform_rules}
              onCheckedChange={(checked) => 
                setConfirmChecks(prev => ({ ...prev, platform_rules: checked as boolean }))
              }
            />
            <Label htmlFor="platform_rules" className="text-sm leading-none">
              J'ai lu et j'accepte les <a href="/cgu" className="text-primary hover:underline" target="_blank">Conditions Générales d'Utilisation (CGU)</a> ainsi que les règles de fonctionnement de la plateforme Colimero.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="safety_confirmation"
              checked={confirmChecks.safety_confirmation}
              onCheckedChange={(checked) => 
                setConfirmChecks(prev => ({ ...prev, safety_confirmation: checked as boolean }))
              }
            />
            <Label htmlFor="safety_confirmation" className="text-sm leading-none">
              Je comprends que je suis seul(e) responsable de la sécurité, du bon état et de la conformité des colis que je transporte dans cette tournée.
            </Label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!Object.values(confirmChecks).every(check => check)}
          >
            Confirmer la création
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}