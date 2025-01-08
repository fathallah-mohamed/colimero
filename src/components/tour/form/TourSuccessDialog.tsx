import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface TourSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function TourSuccessDialog({ open, onOpenChange, onConfirm }: TourSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Tournée créée avec succès
          </DialogTitle>
          <DialogDescription>
            Votre tournée a été créée avec succès. Vous pouvez maintenant la consulter dans votre liste de tournées.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={onConfirm}
            className="w-full"
          >
            J'ai compris
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}