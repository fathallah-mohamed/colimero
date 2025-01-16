import * as React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader as BaseDialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogHeaderProps {
  title: string;
  onClose: () => void;
}

const DialogHeader = ({ title, onClose }: DialogHeaderProps) => (
  <BaseDialogHeader className="relative">
    <DialogTitle>{title}</DialogTitle>
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-0 top-0"
      onClick={onClose}
    >
      <X className="h-4 w-4" />
    </Button>
  </BaseDialogHeader>
);

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function CustomDialog({
  open,
  onClose,
  title,
  children,
  className,
}: CustomDialogProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const initialFocusRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={open} modal={true}>
      <DialogContent
        className={className}
        onInteractOutside={(e) => {
          e.preventDefault(); // Empêche la fermeture au clic extérieur
        }}
      >
        <DialogHeader title={title} onClose={onClose} />
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const isRefable = typeof child.type === 'string' || ('ref' in child.type);
            return isRefable
              ? React.cloneElement(child, { ref: initialFocusRef })
              : child;
          }
          return child;
        })}
      </DialogContent>
    </Dialog>
  );
}