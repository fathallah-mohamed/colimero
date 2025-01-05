import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AccessDeniedMessageProps {
  userType: 'client' | 'carrier';
  isOpen: boolean;
  onClose: () => void;
}

export function AccessDeniedMessage({ userType, isOpen, onClose }: AccessDeniedMessageProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Accès refusé
          </DialogTitle>
          <DialogDescription>
            {userType === 'client' 
              ? "Cette fonctionnalité est réservée aux transporteurs. Les clients ne peuvent pas créer de tournées."
              : "Cette fonctionnalité est réservée aux clients. Veuillez vous connecter avec un compte client."
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>J'ai compris</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}