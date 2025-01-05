import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AccessDeniedMessageProps {
  userType: 'client' | 'carrier';
  open: boolean;
  onClose: () => void;
}

export function AccessDeniedMessage({ userType, open, onClose }: AccessDeniedMessageProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accès non autorisé</DialogTitle>
          <DialogDescription>
            {userType === 'client' 
              ? "Cette fonctionnalité est réservée aux transporteurs. Veuillez vous connecter avec un compte transporteur."
              : "Cette fonctionnalité est réservée aux clients. Veuillez vous connecter avec un compte client."}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}