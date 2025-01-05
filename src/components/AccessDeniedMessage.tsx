import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AccessDeniedMessageProps {
  userType: string;
  open: boolean;
  onClose: () => void;
}

export default function AccessDeniedMessage({ userType, open, onClose }: AccessDeniedMessageProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accès refusé</DialogTitle>
          <DialogDescription>
            {userType === 'client' 
              ? "Les clients ne peuvent pas accéder à cette fonctionnalité. Cette section est réservée aux transporteurs."
              : "Les transporteurs ne peuvent pas accéder à cette fonctionnalité. Cette section est réservée aux clients."
            }
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}