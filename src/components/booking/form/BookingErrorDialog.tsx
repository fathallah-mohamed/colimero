import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface BookingErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

export function BookingErrorDialog({
  open,
  onOpenChange,
  message,
}: BookingErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Réservation impossible
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>J'ai compris</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}