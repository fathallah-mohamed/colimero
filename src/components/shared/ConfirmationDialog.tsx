import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  title,
  message,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Ne rien faire quand l'utilisateur clique en dehors
      // La fermeture ne se fait que par le bouton
      if (!open) {
        return;
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">{message}</p>
          <Button 
            onClick={onClose} 
            className="w-full"
          >
            J'ai compris
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}